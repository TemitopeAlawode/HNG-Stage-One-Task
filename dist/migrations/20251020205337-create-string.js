'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Strings', {
            id: {
                type: Sequelize.STRING(64),
                primaryKey: true,
                allowNull: false,
            },
            value: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            properties: {
                type: Sequelize.JSONB,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Strings');
    }
};
