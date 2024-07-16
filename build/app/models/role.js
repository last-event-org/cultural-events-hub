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
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import User from '#models/user';
export default class Role extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Role.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Role.prototype, "roleName", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Role.prototype, "canCreateEvent", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Role.prototype, "canUpdateEvent", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Role.prototype, "canDeleteEvent", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Role.prototype, "canCreateAddress", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Role.prototype, "canUpdateAddress", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Role.prototype, "canDeleteAddress", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Role.prototype, "canCreateCategory", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Role.prototype, "canUpdateCategory", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Role.prototype, "canDeleteCategory", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Role.prototype, "canBlockUser", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Role.prototype, "canUpdateUser", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Role.prototype, "canDeleteUser", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Role.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Role.prototype, "updatedAt", void 0);
__decorate([
    hasMany(() => User),
    __metadata("design:type", Object)
], Role.prototype, "users", void 0);
//# sourceMappingURL=role.js.map