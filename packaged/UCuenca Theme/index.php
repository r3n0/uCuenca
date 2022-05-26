<?php
/**
 * Index
 *
 * Main footer file for the theme.
 *
 * @category   Components
 * @package    WordPress
 * @subpackage Theme_Name_Here
 * @author     Your Name <yourname@example.com>
 * @license    https://www.gnu.org/licenses/gpl-3.0.txt GNU/GPLv3
 * @link       https://yoursite.com
 * @since      1.0.0
 */

?>

<?php get_header(); ?>
<?php if ( have_posts() ) : ?>
	<div class="post-container">
		<?php while ( have_posts() ) : ?>
			<?php the_post(); ?>
			<div <?php post_class(); ?>>
				<h2>
					<a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>"><?php the_title(); ?> </a>
				</h2>
				<div>
					<?php ucuenca_post_meta(); ?>
				</div>
				<p>
					<?php the_content(); ?>
				</p>
				<?php ucuenca_read_more(); ?>
			</div>
		<?php endwhile; ?>
	</div> <!-- post-container -->
	<?php the_posts_pagination(); ?>
<?php else : ?>
	<?php esc_html_e( 'no se ha encontrado ningún post', 'ucuenca' ); ?>
<?php endif; ?>

<?php get_footer(); ?>
<small>index.php</small>
