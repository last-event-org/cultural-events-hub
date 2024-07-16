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
import Event from '#models/event';
export default class Media extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Media.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Media.prototype, "path", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Media.prototype, "altName", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Media.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Media.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Media.prototype, "eventId", void 0);
__decorate([
    belongsTo(() => Event),
    __metadata("design:type", Object)
], Media.prototype, "event", void 0);
//# sourceMappingURL=media.js.map