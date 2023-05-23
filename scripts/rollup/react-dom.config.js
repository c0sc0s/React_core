import { getBaseRollupPlugins, getPackageJSON, resolvePkgPath } from "./utils";
import generatePackageJson from "rollup-plugin-generate-package-json";
import alias from "@rollup/plugin-alias";

const { name, module } = getPackageJSON("react-dom");
const pkgPath = resolvePkgPath(name);
const pkgDistPath = resolvePkgPath(name, true);

export default [
	// react
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${pkgDistPath}/index.js`,
				format: "umd", //兼容amd、cjs、esm、iife、umd
				name: "index.js"
			},
			{
				file: `${pkgDistPath}/client.js`,
				format: "umd", //兼容amd、cjs、esm、iife、umd
				name: "client.js"
			}
		],
		plugins: [
			...getBaseRollupPlugins(),
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`
				}
			}),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					main: "index.js",
					peerDependencies: {
						react: version
					}
				})
			})
		]
	},
	// jsx-runtime
	{
		input: `${pkgPath}/src/jsx.ts`,
		output: [
			// jsx-runtime
			{
				file: `${pkgDistPath}/jsx-runtime.js`,
				format: "umd",
				name: "jsx-runtime.js"
			},
			// jsx-dev-runtime
			{
				file: `${pkgDistPath}/jsx-dev-runtime.js`,
				format: "umd",
				name: "jsx-dev-runtime.js"
			}
		],
		plugins: getBaseRollupPlugins()
	}
];
