<script lang="ts">
	import Fa from 'svelte-fa';
	import { faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
</script>

<div
	class="page-footer border-t border-surface-500/10 bg-surface-50 text-xs dark:bg-surface-100-800-token md:text-base"
>
	<div class="mx-auto w-full max-w-5xl space-y-10 p-4 py-12">
		<hr class="opacity-20" />
		<section
			class="flex flex-col items-center justify-between space-y-5 md:flex-row md:items-start md:space-y-0"
		>
			<div
				class="grid w-2/5 grid-cols-1 place-content-center place-items-center gap-2 md:place-items-start"
			>
				<img src="/images/logo-2x.png" alt="IndieGrow" class="h-7" />
			</div>
			<div
				class="hidden grid-cols-3 gap-8 md:grid md:place-items-start"
				data-svelte-h="svelte-euzn36"
			>
				<div class="space-y-6">
					<h6 class="h6">Content</h6>
					<ul class="space-y-3">
						<li><a class="anchor" href="/content/news">News</a></li>
						<li><a class="anchor" href="/content/blog">Blog</a></li>
						<li>
							<a class="anchor" href="/content/aso-best-practices">ASO best practices</a>
						</li>
					</ul>
				</div>
				<div class="space-y-6">
					<h6 class="h6">Features</h6>
					<ul class="space-y-3">
						<li><a class="anchor" href="/#competitor-analysis">Competitor Analysis</a></li>
						<li><a class="anchor" href="/#community-pulse">Community Pulse</a></li>
						<li>
							<a class="anchor" href="/#appstore-content">AppStore Content Optimization</a>
						</li>
					</ul>
				</div>
				<div class="space-y-6">
					<h6 class="h6">Team</h6>
					<ul class="space-y-3">
						<li>
							<a
								class="anchor"
								href="https://www.linkedin.com/in/ionutciobotaru/"
								target="_blank"
								rel="noreferrer">Ionut Ciobotaru</a
							>
						</li>
						<li>
							<a
								class="anchor"
								href="https://www.linkedin.com/in/eugenmartin/"
								target="_blank"
								rel="noreferrer">Eugen Martin</a
							>
						</li>
					</ul>
				</div>
			</div>
		</section>
		<hr class="opacity-20" />
		<section
			class="footer-bar flex flex-col items-center justify-between space-y-4 md:flex-row md:items-start md:space-y-0"
		>
			<p>
				<a class="anchor" href="https://indiegrow.dev" target="_blank" rel="noreferrer">IndieGrow</a
				>
				was made with ❤️ in Berlin, Germany.
			</p>
			<div class="flex gap-6">
				<a
					class="opacity-75 hover:opacity-100"
					href="https://www.linkedin.com/in/ionutciobotaru/"
					target="_blank"
					rel="noreferrer"
					title="LinkedIn"
					><Fa icon={faLinkedin} />
				</a>
				<a
					class="opacity-75 hover:opacity-100"
					href="https://x.com/weeb0"
					target="_blank"
					rel="noreferrer"
					title="X (Twitter)"
					><Fa icon={faXTwitter} />
				</a>
				<!-- <a
								class="opacity-75 hover:opacity-100"
								href="https://discord.gg/EXqV7W8MtY"
								target="_blank"
								rel="noreferrer"
								title="Discord"
								><Fa icon={faDiscord} />
							</a> -->
			</div>
		</section>
		<hr class="opacity-20" />
	</div>
</div>
