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
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm';
import Category from '#models/category';
import Event from '#models/event';
export default class CategoryType extends BaseModel {
    serializeExtras = true;
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], CategoryType.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], CategoryType.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], CategoryType.prototype, "categoryId", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], CategoryType.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], CategoryType.prototype, "updatedAt", void 0);
__decorate([
    manyToMany(() => Event, {
        pivotTable: 'category_types_events',
        pivotForeignKey: 'category_type_id',
        pivotRelatedForeignKey: 'event_id',
    }),
    __metadata("design:type", Object)
], CategoryType.prototype, "events", void 0);
__decorate([
    belongsTo(() => Category),
    __metadata("design:type", Object)
], CategoryType.prototype, "category", void 0);
//# sourceMappingURL=category_type.js.map