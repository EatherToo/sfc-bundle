import * as esbuild from 'esbuild'

export type PluginFactory = (args?: any) => esbuild.Plugin
