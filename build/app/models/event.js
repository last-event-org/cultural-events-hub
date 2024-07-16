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
import { BaseModel, column, hasMany, manyToMany, belongsTo } from '@adonisjs/lucid/orm';
import User from '#models/user';
import Address from '#models/address';
import Price from '#models/price';
import CategoryType from '#models/category_type';
import Indicator from '#models/indicator';
import Media from './media.js';
export default class Event extends BaseModel {
    serializeExtras = true;
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Event.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Event.prototype, "subtitle", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Event.prototype, "facebookLink", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Event.prototype, "instagramLink", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Event.prototype, "websiteLink", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Event.prototype, "youtubeLink", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", DateTime)
], Event.prototype, "eventStart", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", DateTime)
], Event.prototype, "eventEnd", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Event.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Event.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Event.prototype, "vendorId", void 0);
__decorate([
    belongsTo(() => User, {
        foreignKey: 'vendorId',
    }),
    __metadata("design:type", Object)
], Event.prototype, "vendor", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Event.prototype, "locationId", void 0);
__decorate([
    belongsTo(() => Address, {
        foreignKey: 'locationId',
    }),
    __metadata("design:type", Object)
], Event.prototype, "location", void 0);
__decorate([
    hasMany(() => Price),
    __metadata("design:type", Object)
], Event.prototype, "prices", void 0);
__decorate([
    hasMany(() => Media),
    __metadata("design:type", Object)
], Event.prototype, "media", void 0);
__decorate([
    manyToMany(() => CategoryType, {
        pivotTable: 'category_types_events',
        pivotForeignKey: 'event_id',
        pivotRelatedForeignKey: 'category_type_id',
    }),
    __metadata("design:type", Object)
], Event.prototype, "categoryTypes", void 0);
__decorate([
    manyToMany(() => Indicator, {
        pivotTable: 'indicators_events',
        pivotForeignKey: 'event_id',
        pivotRelatedForeignKey: 'indicator_id',
    }),
    __metadata("design:type", Object)
], Event.prototype, "indicators", void 0);
__decorate([
    manyToMany(() => User, {
        pivotTable: 'wishlists',
        pivotForeignKey: 'event_id',
        pivotRelatedForeignKey: 'user_id',
    }),
    __metadata("design:type", Object)
], Event.prototype, "usersWhoWishlisted", void 0);
//# sourceMappingURL=event.js.map