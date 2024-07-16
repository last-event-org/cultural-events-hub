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
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import Order from '#models/order';
import Price from '#models/price';
export default class OrderLine extends BaseModel {
    serializeExtras = true;
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], OrderLine.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], OrderLine.prototype, "qty", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], OrderLine.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], OrderLine.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], OrderLine.prototype, "orderId", void 0);
__decorate([
    belongsTo(() => Order),
    __metadata("design:type", Object)
], OrderLine.prototype, "order", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], OrderLine.prototype, "priceId", void 0);
__decorate([
    belongsTo(() => Price),
    __metadata("design:type", Object)
], OrderLine.prototype, "price", void 0);
//# sourceMappingURL=order_line.js.map