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
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm';
import Event from '#models/event';
import User from './user.js';
export default class Address extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Address.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Address.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Address.prototype, "street", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Address.prototype, "number", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Address.prototype, "latitude", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Address.prototype, "longitude", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Address.prototype, "zipCode", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Address.prototype, "userId", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], Address.prototype, "user", void 0);
__decorate([
    hasMany(() => Event),
    __metadata("design:type", Object)
], Address.prototype, "event", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Address.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Address.prototype, "updatedAt", void 0);
//# sourceMappingURL=address.js.map