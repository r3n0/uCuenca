// este es el formato para ES6+, para esto el archivo tiene bable y requiere instlar babel con npm
import gulp from 'gulp'; // para automatzar procesos
import yargs from 'yargs'; // para recivir argumentos como --prod
import cleanCSS from 'gulp-clean-css'; // para minimizar el css
import gulpIf from 'gulp-if'; //para ejecutar una terea en función de una condicional
import sourcemaps from 'gulp-sourcemaps'; // para generar el mapa de SASS en el CSS en desarrollo
import imagemin from 'gulp-imagemin'; // para minimizar imágenes
import del from 'del'; //para borrar carpetas y archivos
import autoprefixer from 'gulp-autoprefixer'; // para poner prefijos en la versión de producción
import webpack from 'webpack-stream'; // para empaquetar los archivos de js en uno solo

const sassComp = require('gulp-sass')(require('sass')); // es el compilador de SASS que no pude inicalizarse usando import porque requiere gulp-sass y sass

// el último argumento es un nobre personalizado
const PRODUCTION = yargs.argv.prod;

const paths = {
	styles: {
		src: ['src/assets/sass/bundle.sass', 'src/assets/sass/admin.sass'],
		dest: 'dist/assets/css',
	},
	images: {
		src: ['src/assets/images/**/*.{jpg, jpeg, png, gif, svg}'],
		dest: 'dist/assets/images',
	},
	scripts: {
		src: 'src/assets/js/bundle.js',
		dest: 'dist/assets/js',
	},
	other: {
		src: [
			'src/assets/**/*',
			'!src/assets/{sass,js,images}',
			'!src/assets/{sass,js,images}/**/*',
		],
		dest: 'dist/assets',
	},
};

// ------- esta tarea borra la carpeta dist
export const clean = () => del(['dist']);

/**
 * esta tadea compila el sass y localiza los archivos finales en la carpeta
 * dist/assets/cs. Cuando se utiliza la bandera --prod (de producction) el
 * css también se atuprefix y se minimisa
 */
export const styles = () => {
	return gulp
		.src(paths.styles.src)
		.pipe(gulpIf(!PRODUCTION, sourcemaps.init()))
		.pipe(sassComp().on('error', (error) => console.log(error)))
		.pipe(
			gulpIf(
				PRODUCTION,
				autoprefixer({
					flexbox: 'no-2009',
					// grid: 'autoplace',
				})
			)
		)
		.pipe(gulpIf(PRODUCTION, cleanCSS({ compatibility: 'ie8' })))
		.pipe(gulpIf(!PRODUCTION, sourcemaps.write()))
		.pipe(gulp.dest(paths.styles.dest));
};

/**
 * esta tarea observa la carpeta de sass, images y todos los archivos de copy
 * y ejecuta la las respectivas tareas
 */
export const watch = () => {
	gulp.watch('src/assets/sass/**/*.sass', styles);
	gulp.watch(paths.images.src, images);
	gulp.watch(paths.scripts.src, scripts);
	gulp.watch(paths.other.src, copy);
};

/**
 * esta tarea mueve las imágenes a la carpteta de dist/assets/images
 * cuando se usa la bandera --prod (de producction) las images se minimisan
 */
export const images = () => {
	return gulp
		.src(paths.images.src)
		.pipe(gulpIf(PRODUCTION, imagemin()))
		.pipe(gulp.dest(paths.images.dest));
};

/**
 * esta tarea copia todos los assets de la carpeta src a la carpeta dist
 * la tarea ignora las carpetas de sass, js e images
 */
export const copy = () => {
	return gulp.src(paths.other.src).pipe(gulp.dest(paths.other.dest));
};

/**
 * Esta tarea unifica todos los arvhicos de js en uno solo
 */
export const scripts = () => {
	return gulp
		.src(paths.scripts.src)
		.pipe(
			webpack({
				module: {
					rules: [
						{
							test: /\.js$/,
							use: {
								loader: 'babel-loader',
								options: {
									presets: ['@babel/preset-env'], //or ['babel-preset-env']
								},
							},
						},
					],
				},
				output: {
					filename: 'bundle.js',
				},
				devtool: !PRODUCTION ? 'inline-source-map' : false,
				mode: PRODUCTION ? 'production' : 'development', //add this
			})
		)
		.pipe(gulp.dest(paths.scripts.dest));
};

/**
 * esta tarea ejetuca primero la tarea clean y luego ejecuta al mismo tiempo las
 * tareas etyles, copy e images
 */
export const dev = gulp.series(
	clean,
	gulp.parallel(styles, copy, images, scripts),
	watch
);

/**
 * esta tarea ejetuca primero la tarea clean y luego ejecuta al mismo tiempo
 * las tareas etyles, copy e images
 */
export const build = gulp.series(
	clean,
	gulp.parallel(styles, copy, images, scripts)
);

export default dev;
