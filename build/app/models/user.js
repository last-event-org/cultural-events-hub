var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DateTime } from 'luxon';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { BaseModel, column, hasOne, hasMany, belongsTo, manyToMany } from '@adonisjs/lucid/orm';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import Role from '#models/role';
import Address from '#models/address';
import Event from '#models/event';
import Order from './order.js';
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
});
export default class User extends compose(BaseModel, AuthFinder) {
    async isUser() {
        const userRole = await Role.findBy('role_name', 'USER');
        if (userRole) {
            return this.roleId === userRole.id;
        }
        return false;
    }
    async isVendor() {
        const userRole = await Role.findBy('role_name', 'VENDOR');
        if (userRole) {
            return this.roleId === userRole.id;
        }
        return false;
    }
    async isAdmin() {
        const userRole = await Role.findBy('role_name', 'ADMIN');
        if (userRole) {
            return this.roleId === userRole.id;
        }
        return false;
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    column({ serializeAs: null }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "firstname", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "lastname", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "companyName", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "vatNumber", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "verificationToken", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    column.dateTime({ autoCreate: false }),
    __metadata("design:type", DateTime)
], User.prototype, "verifiedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "resetToken", void 0);
__decorate([
    column.dateTime({ autoCreate: false }),
    __metadata("design:type", Object)
], User.prototype, "resetTokenExpires", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "isBlocked", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], User.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "roleId", void 0);
__decorate([
    belongsTo(() => Role),
    __metadata("design:type", Object)
], User.prototype, "role", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "billingAddressId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "shippingAddressId", void 0);
__decorate([
    hasMany(() => Order),
    __metadata("design:type", Object)
], User.prototype, "order", void 0);
__decorate([
    hasOne(() => Address, {
        foreignKey: 'id',
        localKey: 'billingAddressId',
    }),
    __metadata("design:type", Object)
], User.prototype, "billingAddress", void 0);
__decorate([
    hasOne(() => Address),
    __metadata("design:type", Object)
], User.prototype, "shippingAddress", void 0);
__decorate([
    manyToMany(() => User, {
        pivotTable: 'favourites',
        pivotForeignKey: 'user_id',
        pivotRelatedForeignKey: 'vendor_id',
    }),
    __metadata("design:type", Object)
], User.prototype, "favouritesUser", void 0);
__decorate([
    manyToMany(() => User, {
        pivotTable: 'favourites',
        pivotForeignKey: 'vendor_id',
        pivotRelatedForeignKey: 'user_id',
    }),
    __metadata("design:type", Object)
], User.prototype, "favouritesVendor", void 0);
__decorate([
    manyToMany(() => Event, {
        pivotTable: 'wishlists',
        pivotForeignKey: 'user_id',
        pivotRelatedForeignKey: 'event_id',
    }),
    __metadata("design:type", Object)
], User.prototype, "wishlistEvents", void 0);
//# sourceMappingURL=user.js.map