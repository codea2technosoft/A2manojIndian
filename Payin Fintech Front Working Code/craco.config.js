const CracoLessPlugin = require('craco-less');
const webpack = require('webpack');
const dotenv = require('dotenv'); 

module.exports = {
    webpack: {
        plugins: {
            add: [
                new webpack.DefinePlugin({
                    process: { env: JSON.stringify(dotenv.config().parsed) }
                })
            ]
        }
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@primary-color': '#6C5DD3',
                            '@menu-item-active-bg': '#E1092A',
                            '@menu-highlight-color': '#FFFFFF',
                            '@input-height-base': '48px',
                            '@table-border-radius-base': '20px',
                            '@btn-height-base': '36px',
                            '@btn-border-radius-base': '8px',
                            '@card-radius': '8px'
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};