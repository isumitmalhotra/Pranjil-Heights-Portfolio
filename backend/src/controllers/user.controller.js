import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { ApiError } from '../middleware/error.middleware.js';

// ============================================
// ADMIN USER MANAGEMENT
// ============================================

/**
 * @desc    Get all users with pagination and filtering
 * @route   GET /api/users
 * @access  Private/Super Admin
 */
export const getAllUsers = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    role = '',
    status = '', // 'active', 'inactive', or '' for all
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Build where clause
  const where = {
    ...(search && {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } }
      ]
    }),
    ...(role && { role }),
    ...(status === 'active' && { isActive: true }),
    ...(status === 'inactive' && { isActive: false })
  };

  // Get users with pagination
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        // Don't return password
        _count: {
          select: {
            contactsHandled: true,
            quotesHandled: true,
            dealersReviewed: true
          }
        }
      }
    }),
    prisma.user.count({ where })
  ]);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / take)
      }
    }
  });
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private/Super Admin
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          contactsHandled: true,
          quotesHandled: true,
          dealersReviewed: true
        }
      }
    }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    data: user
  });
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Super Admin
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, isActive } = req.body;
  const userId = parseInt(id);

  // Find user
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Prevent self-demotion for Super Admin
  if (req.user.id === userId && user.role === 'SUPER_ADMIN' && role !== 'SUPER_ADMIN') {
    throw new ApiError(400, 'You cannot demote yourself from Super Admin');
  }

  // Prevent deactivating yourself
  if (req.user.id === userId && isActive === false) {
    throw new ApiError(400, 'You cannot deactivate your own account');
  }

  // Check if this is the last Super Admin
  if (user.role === 'SUPER_ADMIN' && (role !== 'SUPER_ADMIN' || isActive === false)) {
    const superAdminCount = await prisma.user.count({
      where: { role: 'SUPER_ADMIN', isActive: true }
    });

    if (superAdminCount <= 1) {
      throw new ApiError(400, 'Cannot demote or deactivate the last Super Admin');
    }
  }

  // Check if email is already taken by another user
  if (email && email.toLowerCase() !== user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      throw new ApiError(409, 'Email is already in use by another account');
    }
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(email && { email: email.toLowerCase() }),
      ...(role && { role }),
      ...(isActive !== undefined && { isActive })
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser
  });
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Super Admin
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);

  // Find user
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Prevent self-deletion
  if (req.user.id === userId) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  // Check if this is the last Super Admin
  if (user.role === 'SUPER_ADMIN') {
    const superAdminCount = await prisma.user.count({
      where: { role: 'SUPER_ADMIN', isActive: true }
    });

    if (superAdminCount <= 1) {
      throw new ApiError(400, 'Cannot delete the last Super Admin');
    }
  }

  // Delete user
  await prisma.user.delete({
    where: { id: userId }
  });

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
};

/**
 * @desc    Toggle user status (active/inactive)
 * @route   PATCH /api/users/:id/status
 * @access  Private/Super Admin
 */
export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);

  // Find user
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Prevent toggling own status
  if (req.user.id === userId) {
    throw new ApiError(400, 'You cannot toggle your own account status');
  }

  // Check if this is the last active Super Admin and we're deactivating
  if (user.role === 'SUPER_ADMIN' && user.isActive) {
    const activeSuperAdminCount = await prisma.user.count({
      where: { role: 'SUPER_ADMIN', isActive: true }
    });

    if (activeSuperAdminCount <= 1) {
      throw new ApiError(400, 'Cannot deactivate the last active Super Admin');
    }
  }

  // Toggle status
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.json({
    success: true,
    message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
    data: updatedUser
  });
};

/**
 * @desc    Reset user password (admin initiated)
 * @route   POST /api/users/:id/reset-password
 * @access  Private/Super Admin
 */
export const resetUserPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  const userId = parseInt(id);

  if (!newPassword || newPassword.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters');
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
};

/**
 * @desc    Get user statistics
 * @route   GET /api/users/stats
 * @access  Private/Super Admin
 */
export const getUserStats = async (req, res) => {
  const [totalUsers, activeUsers, byRole] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    })
  ]);

  // Convert role stats to object
  const roleStats = byRole.reduce((acc, curr) => {
    acc[curr.role] = curr._count.role;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      byRole: roleStats
    }
  });
};
