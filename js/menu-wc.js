'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">@open-sauced/api.opensauced.pizza documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-c6f80c7077ec081824d99a3f87c1f365009160c0a63d700ca5c65ca5217fc804ad5b632c403894852369c913c862001fcb81b9878ce07326eade18bf48bcac95"' : 'data-target="#xs-controllers-links-module-AuthModule-c6f80c7077ec081824d99a3f87c1f365009160c0a63d700ca5c65ca5217fc804ad5b632c403894852369c913c862001fcb81b9878ce07326eade18bf48bcac95"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-c6f80c7077ec081824d99a3f87c1f365009160c0a63d700ca5c65ca5217fc804ad5b632c403894852369c913c862001fcb81b9878ce07326eade18bf48bcac95"' :
                                            'id="xs-controllers-links-module-AuthModule-c6f80c7077ec081824d99a3f87c1f365009160c0a63d700ca5c65ca5217fc804ad5b632c403894852369c913c862001fcb81b9878ce07326eade18bf48bcac95"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-c6f80c7077ec081824d99a3f87c1f365009160c0a63d700ca5c65ca5217fc804ad5b632c403894852369c913c862001fcb81b9878ce07326eade18bf48bcac95"' : 'data-target="#xs-injectables-links-module-AuthModule-c6f80c7077ec081824d99a3f87c1f365009160c0a63d700ca5c65ca5217fc804ad5b632c403894852369c913c862001fcb81b9878ce07326eade18bf48bcac95"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-c6f80c7077ec081824d99a3f87c1f365009160c0a63d700ca5c65ca5217fc804ad5b632c403894852369c913c862001fcb81b9878ce07326eade18bf48bcac95"' :
                                        'id="xs-injectables-links-module-AuthModule-c6f80c7077ec081824d99a3f87c1f365009160c0a63d700ca5c65ca5217fc804ad5b632c403894852369c913c862001fcb81b9878ce07326eade18bf48bcac95"' }>
                                        <li class="link">
                                            <a href="injectables/SupabaseGuard.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SupabaseGuard</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SupabaseStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SupabaseStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ContributionModule.html" data-type="entity-link" >ContributionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ContributionModule-be91dc893dfe8001d57357220e37aff8d97508385778f3ce9c239b68509d2fbce6406743422f3edb74091226752bde9b754b0d97f9f93884349b73ebe988ad87"' : 'data-target="#xs-controllers-links-module-ContributionModule-be91dc893dfe8001d57357220e37aff8d97508385778f3ce9c239b68509d2fbce6406743422f3edb74091226752bde9b754b0d97f9f93884349b73ebe988ad87"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ContributionModule-be91dc893dfe8001d57357220e37aff8d97508385778f3ce9c239b68509d2fbce6406743422f3edb74091226752bde9b754b0d97f9f93884349b73ebe988ad87"' :
                                            'id="xs-controllers-links-module-ContributionModule-be91dc893dfe8001d57357220e37aff8d97508385778f3ce9c239b68509d2fbce6406743422f3edb74091226752bde9b754b0d97f9f93884349b73ebe988ad87"' }>
                                            <li class="link">
                                                <a href="controllers/RepoContributionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoContributionsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ContributionModule-be91dc893dfe8001d57357220e37aff8d97508385778f3ce9c239b68509d2fbce6406743422f3edb74091226752bde9b754b0d97f9f93884349b73ebe988ad87"' : 'data-target="#xs-injectables-links-module-ContributionModule-be91dc893dfe8001d57357220e37aff8d97508385778f3ce9c239b68509d2fbce6406743422f3edb74091226752bde9b754b0d97f9f93884349b73ebe988ad87"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ContributionModule-be91dc893dfe8001d57357220e37aff8d97508385778f3ce9c239b68509d2fbce6406743422f3edb74091226752bde9b754b0d97f9f93884349b73ebe988ad87"' :
                                        'id="xs-injectables-links-module-ContributionModule-be91dc893dfe8001d57357220e37aff8d97508385778f3ce9c239b68509d2fbce6406743422f3edb74091226752bde9b754b0d97f9f93884349b73ebe988ad87"' }>
                                        <li class="link">
                                            <a href="injectables/ContributionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContributionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RepoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CustomerModule.html" data-type="entity-link" >CustomerModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CustomerModule-5b6ff6371877b516aeff77bc05b7dfb20221d7152cd7d709e9719614b43d7f87c67f29a9ffce06b80ea4f03c9e389bce9d7474208e24f1ef856b533f985f794c"' : 'data-target="#xs-injectables-links-module-CustomerModule-5b6ff6371877b516aeff77bc05b7dfb20221d7152cd7d709e9719614b43d7f87c67f29a9ffce06b80ea4f03c9e389bce9d7474208e24f1ef856b533f985f794c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CustomerModule-5b6ff6371877b516aeff77bc05b7dfb20221d7152cd7d709e9719614b43d7f87c67f29a9ffce06b80ea4f03c9e389bce9d7474208e24f1ef856b533f985f794c"' :
                                        'id="xs-injectables-links-module-CustomerModule-5b6ff6371877b516aeff77bc05b7dfb20221d7152cd7d709e9719614b43d7f87c67f29a9ffce06b80ea4f03c9e389bce9d7474208e24f1ef856b533f985f794c"' }>
                                        <li class="link">
                                            <a href="injectables/CustomerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HealthModule.html" data-type="entity-link" >HealthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-HealthModule-4b73503c69517ba43047a9d63e39bb6a5e944bcce5b8c68be3994aa1abb0bb078c90f82c671a5c155cc031f1a010ff51450da078e646904377016677e4d35f74"' : 'data-target="#xs-controllers-links-module-HealthModule-4b73503c69517ba43047a9d63e39bb6a5e944bcce5b8c68be3994aa1abb0bb078c90f82c671a5c155cc031f1a010ff51450da078e646904377016677e4d35f74"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HealthModule-4b73503c69517ba43047a9d63e39bb6a5e944bcce5b8c68be3994aa1abb0bb078c90f82c671a5c155cc031f1a010ff51450da078e646904377016677e4d35f74"' :
                                            'id="xs-controllers-links-module-HealthModule-4b73503c69517ba43047a9d63e39bb6a5e944bcce5b8c68be3994aa1abb0bb078c90f82c671a5c155cc031f1a010ff51450da078e646904377016677e4d35f74"' }>
                                            <li class="link">
                                                <a href="controllers/HealthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HealthController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InsightsModule.html" data-type="entity-link" >InsightsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-InsightsModule-47ff4d9886596034126695fee46e1af69716777667f54d117d525fb1617ee2b9f0d28a99415f0eba5851a534db1afe6330aba1c8b7e6263759842612e96326fe"' : 'data-target="#xs-controllers-links-module-InsightsModule-47ff4d9886596034126695fee46e1af69716777667f54d117d525fb1617ee2b9f0d28a99415f0eba5851a534db1afe6330aba1c8b7e6263759842612e96326fe"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-InsightsModule-47ff4d9886596034126695fee46e1af69716777667f54d117d525fb1617ee2b9f0d28a99415f0eba5851a534db1afe6330aba1c8b7e6263759842612e96326fe"' :
                                            'id="xs-controllers-links-module-InsightsModule-47ff4d9886596034126695fee46e1af69716777667f54d117d525fb1617ee2b9f0d28a99415f0eba5851a534db1afe6330aba1c8b7e6263759842612e96326fe"' }>
                                            <li class="link">
                                                <a href="controllers/InsightController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InsightController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserInsightsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserInsightsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-InsightsModule-47ff4d9886596034126695fee46e1af69716777667f54d117d525fb1617ee2b9f0d28a99415f0eba5851a534db1afe6330aba1c8b7e6263759842612e96326fe"' : 'data-target="#xs-injectables-links-module-InsightsModule-47ff4d9886596034126695fee46e1af69716777667f54d117d525fb1617ee2b9f0d28a99415f0eba5851a534db1afe6330aba1c8b7e6263759842612e96326fe"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InsightsModule-47ff4d9886596034126695fee46e1af69716777667f54d117d525fb1617ee2b9f0d28a99415f0eba5851a534db1afe6330aba1c8b7e6263759842612e96326fe"' :
                                        'id="xs-injectables-links-module-InsightsModule-47ff4d9886596034126695fee46e1af69716777667f54d117d525fb1617ee2b9f0d28a99415f0eba5851a534db1afe6330aba1c8b7e6263759842612e96326fe"' }>
                                        <li class="link">
                                            <a href="injectables/InsightRepoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InsightRepoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/InsightsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InsightsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RepoModule.html" data-type="entity-link" >RepoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-RepoModule-b95caf75b55d1217517d16c7f844a115ce78180b039ac85a93705a508c0ea8d042189685e2b64d67741e9218f93af941481f2f30ba2f342bf54da5812aab54f6"' : 'data-target="#xs-controllers-links-module-RepoModule-b95caf75b55d1217517d16c7f844a115ce78180b039ac85a93705a508c0ea8d042189685e2b64d67741e9218f93af941481f2f30ba2f342bf54da5812aab54f6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RepoModule-b95caf75b55d1217517d16c7f844a115ce78180b039ac85a93705a508c0ea8d042189685e2b64d67741e9218f93af941481f2f30ba2f342bf54da5812aab54f6"' :
                                            'id="xs-controllers-links-module-RepoModule-b95caf75b55d1217517d16c7f844a115ce78180b039ac85a93705a508c0ea8d042189685e2b64d67741e9218f93af941481f2f30ba2f342bf54da5812aab54f6"' }>
                                            <li class="link">
                                                <a href="controllers/RepoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RepoModule-b95caf75b55d1217517d16c7f844a115ce78180b039ac85a93705a508c0ea8d042189685e2b64d67741e9218f93af941481f2f30ba2f342bf54da5812aab54f6"' : 'data-target="#xs-injectables-links-module-RepoModule-b95caf75b55d1217517d16c7f844a115ce78180b039ac85a93705a508c0ea8d042189685e2b64d67741e9218f93af941481f2f30ba2f342bf54da5812aab54f6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RepoModule-b95caf75b55d1217517d16c7f844a115ce78180b039ac85a93705a508c0ea8d042189685e2b64d67741e9218f93af941481f2f30ba2f342bf54da5812aab54f6"' :
                                        'id="xs-injectables-links-module-RepoModule-b95caf75b55d1217517d16c7f844a115ce78180b039ac85a93705a508c0ea8d042189685e2b64d67741e9218f93af941481f2f30ba2f342bf54da5812aab54f6"' }>
                                        <li class="link">
                                            <a href="injectables/RepoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StargazeModule.html" data-type="entity-link" >StargazeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-StargazeModule-8c8a5ad270b0e31eccab3a66ca43ee8d44cf3a216292903a9944888200d69e0a796961b5a2c657ffa16b88ca3dbee3bc3bc2e5d9ce9bc897ef94abe91cf7b03f"' : 'data-target="#xs-controllers-links-module-StargazeModule-8c8a5ad270b0e31eccab3a66ca43ee8d44cf3a216292903a9944888200d69e0a796961b5a2c657ffa16b88ca3dbee3bc3bc2e5d9ce9bc897ef94abe91cf7b03f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StargazeModule-8c8a5ad270b0e31eccab3a66ca43ee8d44cf3a216292903a9944888200d69e0a796961b5a2c657ffa16b88ca3dbee3bc3bc2e5d9ce9bc897ef94abe91cf7b03f"' :
                                            'id="xs-controllers-links-module-StargazeModule-8c8a5ad270b0e31eccab3a66ca43ee8d44cf3a216292903a9944888200d69e0a796961b5a2c657ffa16b88ca3dbee3bc3bc2e5d9ce9bc897ef94abe91cf7b03f"' }>
                                            <li class="link">
                                                <a href="controllers/RepoStargazeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoStargazeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StargazeModule-8c8a5ad270b0e31eccab3a66ca43ee8d44cf3a216292903a9944888200d69e0a796961b5a2c657ffa16b88ca3dbee3bc3bc2e5d9ce9bc897ef94abe91cf7b03f"' : 'data-target="#xs-injectables-links-module-StargazeModule-8c8a5ad270b0e31eccab3a66ca43ee8d44cf3a216292903a9944888200d69e0a796961b5a2c657ffa16b88ca3dbee3bc3bc2e5d9ce9bc897ef94abe91cf7b03f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StargazeModule-8c8a5ad270b0e31eccab3a66ca43ee8d44cf3a216292903a9944888200d69e0a796961b5a2c657ffa16b88ca3dbee3bc3bc2e5d9ce9bc897ef94abe91cf7b03f"' :
                                        'id="xs-injectables-links-module-StargazeModule-8c8a5ad270b0e31eccab3a66ca43ee8d44cf3a216292903a9944888200d69e0a796961b5a2c657ffa16b88ca3dbee3bc3bc2e5d9ce9bc897ef94abe91cf7b03f"' }>
                                        <li class="link">
                                            <a href="injectables/RepoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StargazeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StargazeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StarModule.html" data-type="entity-link" >StarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-StarModule-e51876d49cb46b6ee91444480c64009472b9e3f86a95f55d6eb73e4ac3b75009ab20d13fffa39211831b8d4087e9fe6ae70776b192ce5f5c117edabc89a925d1"' : 'data-target="#xs-controllers-links-module-StarModule-e51876d49cb46b6ee91444480c64009472b9e3f86a95f55d6eb73e4ac3b75009ab20d13fffa39211831b8d4087e9fe6ae70776b192ce5f5c117edabc89a925d1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StarModule-e51876d49cb46b6ee91444480c64009472b9e3f86a95f55d6eb73e4ac3b75009ab20d13fffa39211831b8d4087e9fe6ae70776b192ce5f5c117edabc89a925d1"' :
                                            'id="xs-controllers-links-module-StarModule-e51876d49cb46b6ee91444480c64009472b9e3f86a95f55d6eb73e4ac3b75009ab20d13fffa39211831b8d4087e9fe6ae70776b192ce5f5c117edabc89a925d1"' }>
                                            <li class="link">
                                                <a href="controllers/RepoStarController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoStarController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StarModule-e51876d49cb46b6ee91444480c64009472b9e3f86a95f55d6eb73e4ac3b75009ab20d13fffa39211831b8d4087e9fe6ae70776b192ce5f5c117edabc89a925d1"' : 'data-target="#xs-injectables-links-module-StarModule-e51876d49cb46b6ee91444480c64009472b9e3f86a95f55d6eb73e4ac3b75009ab20d13fffa39211831b8d4087e9fe6ae70776b192ce5f5c117edabc89a925d1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StarModule-e51876d49cb46b6ee91444480c64009472b9e3f86a95f55d6eb73e4ac3b75009ab20d13fffa39211831b8d4087e9fe6ae70776b192ce5f5c117edabc89a925d1"' :
                                        'id="xs-injectables-links-module-StarModule-e51876d49cb46b6ee91444480c64009472b9e3f86a95f55d6eb73e4ac3b75009ab20d13fffa39211831b8d4087e9fe6ae70776b192ce5f5c117edabc89a925d1"' }>
                                        <li class="link">
                                            <a href="injectables/RepoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StarService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StripeModule.html" data-type="entity-link" >StripeModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StripeModule-150466fad28d08c74a0e6513c8911afdd3b508dd3e526d3acb0709e3676cf02b9b1eb916d29b9fa498b5d7ce914c5fac1aa11e0c0ec2de0f71fb9fe399504e2a"' : 'data-target="#xs-injectables-links-module-StripeModule-150466fad28d08c74a0e6513c8911afdd3b508dd3e526d3acb0709e3676cf02b9b1eb916d29b9fa498b5d7ce914c5fac1aa11e0c0ec2de0f71fb9fe399504e2a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StripeModule-150466fad28d08c74a0e6513c8911afdd3b508dd3e526d3acb0709e3676cf02b9b1eb916d29b9fa498b5d7ce914c5fac1aa11e0c0ec2de0f71fb9fe399504e2a"' :
                                        'id="xs-injectables-links-module-StripeModule-150466fad28d08c74a0e6513c8911afdd3b508dd3e526d3acb0709e3676cf02b9b1eb916d29b9fa498b5d7ce914c5fac1aa11e0c0ec2de0f71fb9fe399504e2a"' }>
                                        <li class="link">
                                            <a href="injectables/StripeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StripeSubscriptionModule.html" data-type="entity-link" >StripeSubscriptionModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StripeSubscriptionModule-5126109523168738a6d0306b830e2633233aca7df26cc9dc96c249a2bb2e77d683997735432cb595e3ad0900d8a13fcfbe91cbc1e52ea7727c376a5ad793b651"' : 'data-target="#xs-injectables-links-module-StripeSubscriptionModule-5126109523168738a6d0306b830e2633233aca7df26cc9dc96c249a2bb2e77d683997735432cb595e3ad0900d8a13fcfbe91cbc1e52ea7727c376a5ad793b651"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StripeSubscriptionModule-5126109523168738a6d0306b830e2633233aca7df26cc9dc96c249a2bb2e77d683997735432cb595e3ad0900d8a13fcfbe91cbc1e52ea7727c376a5ad793b651"' :
                                        'id="xs-injectables-links-module-StripeSubscriptionModule-5126109523168738a6d0306b830e2633233aca7df26cc9dc96c249a2bb2e77d683997735432cb595e3ad0900d8a13fcfbe91cbc1e52ea7727c376a5ad793b651"' }>
                                        <li class="link">
                                            <a href="injectables/StripeSubscriptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripeSubscriptionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StripeWebHookModule.html" data-type="entity-link" >StripeWebHookModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-StripeWebHookModule-68bc2ba390ebd417a82096243884860494e5da069769f185e09958c579e83250e98c5359668f61310b0b43a8597f2200c8dc36ecd0d6951b688e43919ba82478"' : 'data-target="#xs-controllers-links-module-StripeWebHookModule-68bc2ba390ebd417a82096243884860494e5da069769f185e09958c579e83250e98c5359668f61310b0b43a8597f2200c8dc36ecd0d6951b688e43919ba82478"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StripeWebHookModule-68bc2ba390ebd417a82096243884860494e5da069769f185e09958c579e83250e98c5359668f61310b0b43a8597f2200c8dc36ecd0d6951b688e43919ba82478"' :
                                            'id="xs-controllers-links-module-StripeWebHookModule-68bc2ba390ebd417a82096243884860494e5da069769f185e09958c579e83250e98c5359668f61310b0b43a8597f2200c8dc36ecd0d6951b688e43919ba82478"' }>
                                            <li class="link">
                                                <a href="controllers/StripeWebhookController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StripeWebhookController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SubmitModule.html" data-type="entity-link" >SubmitModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-SubmitModule-eafec87aeee3739d3008cb50a3b06e7cb260611d5f95b41fae2e09a66a569011cdf54d0c08421a87e8437099d339a2cdf612c21bdfe364d1c82ef68fd6dea013"' : 'data-target="#xs-controllers-links-module-SubmitModule-eafec87aeee3739d3008cb50a3b06e7cb260611d5f95b41fae2e09a66a569011cdf54d0c08421a87e8437099d339a2cdf612c21bdfe364d1c82ef68fd6dea013"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SubmitModule-eafec87aeee3739d3008cb50a3b06e7cb260611d5f95b41fae2e09a66a569011cdf54d0c08421a87e8437099d339a2cdf612c21bdfe364d1c82ef68fd6dea013"' :
                                            'id="xs-controllers-links-module-SubmitModule-eafec87aeee3739d3008cb50a3b06e7cb260611d5f95b41fae2e09a66a569011cdf54d0c08421a87e8437099d339a2cdf612c21bdfe364d1c82ef68fd6dea013"' }>
                                            <li class="link">
                                                <a href="controllers/RepoSubmitController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoSubmitController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SubmitModule-eafec87aeee3739d3008cb50a3b06e7cb260611d5f95b41fae2e09a66a569011cdf54d0c08421a87e8437099d339a2cdf612c21bdfe364d1c82ef68fd6dea013"' : 'data-target="#xs-injectables-links-module-SubmitModule-eafec87aeee3739d3008cb50a3b06e7cb260611d5f95b41fae2e09a66a569011cdf54d0c08421a87e8437099d339a2cdf612c21bdfe364d1c82ef68fd6dea013"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SubmitModule-eafec87aeee3739d3008cb50a3b06e7cb260611d5f95b41fae2e09a66a569011cdf54d0c08421a87e8437099d339a2cdf612c21bdfe364d1c82ef68fd6dea013"' :
                                        'id="xs-injectables-links-module-SubmitModule-eafec87aeee3739d3008cb50a3b06e7cb260611d5f95b41fae2e09a66a569011cdf54d0c08421a87e8437099d339a2cdf612c21bdfe364d1c82ef68fd6dea013"' }>
                                        <li class="link">
                                            <a href="injectables/RepoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SubmitService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SubmitService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-6a900220b381761145d169512291b32ab111dd587aae082763830e9171ff8add2527e9db16ab20914aa092e295e47026f55a52deff96d6b482c2644de227b770"' : 'data-target="#xs-controllers-links-module-UserModule-6a900220b381761145d169512291b32ab111dd587aae082763830e9171ff8add2527e9db16ab20914aa092e295e47026f55a52deff96d6b482c2644de227b770"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-6a900220b381761145d169512291b32ab111dd587aae082763830e9171ff8add2527e9db16ab20914aa092e295e47026f55a52deff96d6b482c2644de227b770"' :
                                            'id="xs-controllers-links-module-UserModule-6a900220b381761145d169512291b32ab111dd587aae082763830e9171ff8add2527e9db16ab20914aa092e295e47026f55a52deff96d6b482c2644de227b770"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-6a900220b381761145d169512291b32ab111dd587aae082763830e9171ff8add2527e9db16ab20914aa092e295e47026f55a52deff96d6b482c2644de227b770"' : 'data-target="#xs-injectables-links-module-UserModule-6a900220b381761145d169512291b32ab111dd587aae082763830e9171ff8add2527e9db16ab20914aa092e295e47026f55a52deff96d6b482c2644de227b770"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-6a900220b381761145d169512291b32ab111dd587aae082763830e9171ff8add2527e9db16ab20914aa092e295e47026f55a52deff96d6b482c2644de227b770"' :
                                        'id="xs-injectables-links-module-UserModule-6a900220b381761145d169512291b32ab111dd587aae082763830e9171ff8add2527e9db16ab20914aa092e295e47026f55a52deff96d6b482c2644de227b770"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserReposModule.html" data-type="entity-link" >UserReposModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserReposModule-809c6a17b498102a04308d552ee62e0f2ec12e8fc01579097a0abbc9215a8a43b3bc606fe36d8b35bfa05e56175daea45bfd6e13e91a66ec181a9f202748781e"' : 'data-target="#xs-injectables-links-module-UserReposModule-809c6a17b498102a04308d552ee62e0f2ec12e8fc01579097a0abbc9215a8a43b3bc606fe36d8b35bfa05e56175daea45bfd6e13e91a66ec181a9f202748781e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserReposModule-809c6a17b498102a04308d552ee62e0f2ec12e8fc01579097a0abbc9215a8a43b3bc606fe36d8b35bfa05e56175daea45bfd6e13e91a66ec181a9f202748781e"' :
                                        'id="xs-injectables-links-module-UserReposModule-809c6a17b498102a04308d552ee62e0f2ec12e8fc01579097a0abbc9215a8a43b3bc606fe36d8b35bfa05e56175daea45bfd6e13e91a66ec181a9f202748781e"' }>
                                        <li class="link">
                                            <a href="injectables/UserReposService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserReposService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VoteModule.html" data-type="entity-link" >VoteModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-VoteModule-29748be370b03afb92b3c1c243e6a0a6f9cd3b80c39129bbfb680c1cb09fcb0d3e5b9fd0c46e06397632d52ba6c2e3f12f13048f8fc34ae04b813c6f7d4f29f7"' : 'data-target="#xs-controllers-links-module-VoteModule-29748be370b03afb92b3c1c243e6a0a6f9cd3b80c39129bbfb680c1cb09fcb0d3e5b9fd0c46e06397632d52ba6c2e3f12f13048f8fc34ae04b813c6f7d4f29f7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-VoteModule-29748be370b03afb92b3c1c243e6a0a6f9cd3b80c39129bbfb680c1cb09fcb0d3e5b9fd0c46e06397632d52ba6c2e3f12f13048f8fc34ae04b813c6f7d4f29f7"' :
                                            'id="xs-controllers-links-module-VoteModule-29748be370b03afb92b3c1c243e6a0a6f9cd3b80c39129bbfb680c1cb09fcb0d3e5b9fd0c46e06397632d52ba6c2e3f12f13048f8fc34ae04b813c6f7d4f29f7"' }>
                                            <li class="link">
                                                <a href="controllers/RepoVoteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoVoteController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-VoteModule-29748be370b03afb92b3c1c243e6a0a6f9cd3b80c39129bbfb680c1cb09fcb0d3e5b9fd0c46e06397632d52ba6c2e3f12f13048f8fc34ae04b813c6f7d4f29f7"' : 'data-target="#xs-injectables-links-module-VoteModule-29748be370b03afb92b3c1c243e6a0a6f9cd3b80c39129bbfb680c1cb09fcb0d3e5b9fd0c46e06397632d52ba6c2e3f12f13048f8fc34ae04b813c6f7d4f29f7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VoteModule-29748be370b03afb92b3c1c243e6a0a6f9cd3b80c39129bbfb680c1cb09fcb0d3e5b9fd0c46e06397632d52ba6c2e3f12f13048f8fc34ae04b813c6f7d4f29f7"' :
                                        'id="xs-injectables-links-module-VoteModule-29748be370b03afb92b3c1c243e6a0a6f9cd3b80c39129bbfb680c1cb09fcb0d3e5b9fd0c46e06397632d52ba6c2e3f12f13048f8fc34ae04b813c6f7d4f29f7"' }>
                                        <li class="link">
                                            <a href="injectables/RepoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/VoteService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VoteService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/DbContribution.html" data-type="entity-link" >DbContribution</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbCustomer.html" data-type="entity-link" >DbCustomer</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbInsight.html" data-type="entity-link" >DbInsight</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbInsightRepo.html" data-type="entity-link" >DbInsightRepo</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbRepo.html" data-type="entity-link" >DbRepo</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbRepoToUserStargazers.html" data-type="entity-link" >DbRepoToUserStargazers</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbRepoToUserStars.html" data-type="entity-link" >DbRepoToUserStars</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbRepoToUserSubmissions.html" data-type="entity-link" >DbRepoToUserSubmissions</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbRepoToUserVotes.html" data-type="entity-link" >DbRepoToUserVotes</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbSubscription.html" data-type="entity-link" >DbSubscription</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbUser.html" data-type="entity-link" >DbUser</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbUserRepo.html" data-type="entity-link" >DbUserRepo</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ContributionPageOptionsDto.html" data-type="entity-link" >ContributionPageOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateInsightDto.html" data-type="entity-link" >CreateInsightDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseLoggerMiddleware.html" data-type="entity-link" >DatabaseLoggerMiddleware</a>
                            </li>
                            <li class="link">
                                <a href="classes/InsightPageOptionsDto.html" data-type="entity-link" >InsightPageOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageDto.html" data-type="entity-link" >PageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageMetaDto.html" data-type="entity-link" >PageMetaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageOptionsDto.html" data-type="entity-link" >PageOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepoPageOptionsDto.html" data-type="entity-link" >RepoPageOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SupabaseAuthDto.html" data-type="entity-link" >SupabaseAuthDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateInsightDto.html" data-type="entity-link" >UpdateInsightDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRepoOptionsDto.html" data-type="entity-link" >UserRepoOptionsDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/HttpLoggerMiddleware.html" data-type="entity-link" >HttpLoggerMiddleware</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/PageMetaParameters.html" data-type="entity-link" >PageMetaParameters</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});