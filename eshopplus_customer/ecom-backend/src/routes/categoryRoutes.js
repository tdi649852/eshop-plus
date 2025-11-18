const express = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { USER_ROLES } = require('../utils/constants');

const router = express.Router();

router.get('/', categoryController.listCategories);
router.post('/', authMiddleware, authorizeRoles(USER_ROLES.ADMIN), categoryController.createCategory);
router.put('/:id', authMiddleware, authorizeRoles(USER_ROLES.ADMIN), categoryController.updateCategory);
router.delete('/:id', authMiddleware, authorizeRoles(USER_ROLES.ADMIN), categoryController.deleteCategory);

module.exports = router;


