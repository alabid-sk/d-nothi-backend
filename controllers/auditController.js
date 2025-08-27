// controllers/auditController.js

/**
 * Audit Controller
 * Logs all create, update, delete actions for tasks, leaves, and other entities
 */

const pool = require('../db');

/**
 * Log an audit entry
 * @param {string} entity_type - Type of entity ('task', 'leave', etc.)
 * @param {string} entity_id - UUID of the entity
 * @param {string} action - Action performed ('created', 'updated', 'deleted')
 * @param {object|null} oldData - Previous state before change
 * @param {object|null} newData - New state after change
 * @param {string} performed_by - UUID of the user performing the action
 */
exports.logAudit = async (entity_type, entity_id, action, oldData, newData, performed_by) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs(entity_type, entity_id, action, old_data, new_data, performed_by, performed_at)
       VALUES($1, $2, $3, $4, $5, $6, now())`,
      [
        entity_type,
        entity_id,
        action,
        oldData ? JSON.stringify(oldData) : null,
        newData ? JSON.stringify(newData) : null,
        performed_by
      ]
    );
    console.log(`Audit logged for ${entity_type} ${entity_id} by user ${performed_by}`);
  } catch (err) {
    console.error("Error logging audit:", err.message);
  }
};

/**
 * Example usage:
 *
 * const { logAudit } = require('./auditController');
 *
 * // After creating a task
 * logAudit('task', taskId, 'created', null, newTaskData, userId);
 *
 * // After updating a leave
 * logAudit('leave', leaveId, 'updated', oldLeaveData, updatedLeaveData, userId);
 */
