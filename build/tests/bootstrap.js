import { assert } from '@japa/assert';
import app from '@adonisjs/core/services/app';
import { pluginAdonisJS } from '@japa/plugin-adonisjs';
import testUtils from '@adonisjs/core/services/test_utils';
export const plugins = [assert(), pluginAdonisJS(app)];
export const runnerHooks = {
    setup: [],
    teardown: [],
};
export const configureSuite = (suite) => {
    if (['browser', 'functional', 'e2e'].includes(suite.name)) {
        return suite.setup(() => testUtils.httpServer().start());
    }
};
//# sourceMappingURL=bootstrap.js.map