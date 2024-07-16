import Category from '#models/category';
export default class CategoriesController {
    async index({}) {
        const categories = Category.all();
        return categories;
    }
    async create({}) { }
    async store({ request }) { }
    async show({ params }) { }
    async edit({ params }) { }
    async update({ params, request }) { }
    async destroy({ params }) { }
}
//# sourceMappingURL=categories_controller.js.map