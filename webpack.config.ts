import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const config: Configuration = {
    entry: './src/index.tsx',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: { transpileOnly: true },
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { modules: false }],
                                ['@babel/preset-react', { runtime: 'automatic' }],
                                '@babel/preset-typescript',
                            ],
                            plugins: [['babel-plugin-reactylon']],
                        },
                    },
                ],
                exclude: '/node_modules/',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: 'public/index.html' }),
        new ForkTsCheckerWebpackPlugin(),
        // Copy planet textures from public/ into dist/ so they are served at /textures/*
        new CopyPlugin({
            patterns: [
                { from: 'public/textures', to: 'textures' },
            ],
        }),
    ],
};

export default config;
