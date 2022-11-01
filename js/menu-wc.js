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
                                            'data-target="#controllers-links-module-AuthModule-c3f1e72e7a9a05a6b348e0ddc0b8d602cf619efda9a29be752f430484194c77b6c978a565655f38c999071b436b067aab3739e91f045811d454e46dc0b4b3fa6"' : 'data-target="#xs-controllers-links-module-AuthModule-c3f1e72e7a9a05a6b348e0ddc0b8d602cf619efda9a29be752f430484194c77b6c978a565655f38c999071b436b067aab3739e91f045811d454e46dc0b4b3fa6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-c3f1e72e7a9a05a6b348e0ddc0b8d602cf619efda9a29be752f430484194c77b6c978a565655f38c999071b436b067aab3739e91f045811d454e46dc0b4b3fa6"' :
                                            'id="xs-controllers-links-module-AuthModule-c3f1e72e7a9a05a6b348e0ddc0b8d602cf619efda9a29be752f430484194c77b6c978a565655f38c999071b436b067aab3739e91f045811d454e46dc0b4b3fa6"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-c3f1e72e7a9a05a6b348e0ddc0b8d602cf619efda9a29be752f430484194c77b6c978a565655f38c999071b436b067aab3739e91f045811d454e46dc0b4b3fa6"' : 'data-target="#xs-injectables-links-module-AuthModule-c3f1e72e7a9a05a6b348e0ddc0b8d602cf619efda9a29be752f430484194c77b6c978a565655f38c999071b436b067aab3739e91f045811d454e46dc0b4b3fa6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-c3f1e72e7a9a05a6b348e0ddc0b8d602cf619efda9a29be752f430484194c77b6c978a565655f38c999071b436b067aab3739e91f045811d454e46dc0b4b3fa6"' :
                                        'id="xs-injectables-links-module-AuthModule-c3f1e72e7a9a05a6b348e0ddc0b8d602cf619efda9a29be752f430484194c77b6c978a565655f38c999071b436b067aab3739e91f045811d454e46dc0b4b3fa6"' }>
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
                                            'data-target="#controllers-links-module-InsightsModule-11201c0a35b1c1a3fbf39e20ab5242e9aad10a5203b801b818d14f252de428107f22771806356085c128a669cd9ddfbb52089da9e42921b14c89f901b842a099"' : 'data-target="#xs-controllers-links-module-InsightsModule-11201c0a35b1c1a3fbf39e20ab5242e9aad10a5203b801b818d14f252de428107f22771806356085c128a669cd9ddfbb52089da9e42921b14c89f901b842a099"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-InsightsModule-11201c0a35b1c1a3fbf39e20ab5242e9aad10a5203b801b818d14f252de428107f22771806356085c128a669cd9ddfbb52089da9e42921b14c89f901b842a099"' :
                                            'id="xs-controllers-links-module-InsightsModule-11201c0a35b1c1a3fbf39e20ab5242e9aad10a5203b801b818d14f252de428107f22771806356085c128a669cd9ddfbb52089da9e42921b14c89f901b842a099"' }>
                                            <li class="link">
                                                <a href="controllers/InsightsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InsightsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-InsightsModule-11201c0a35b1c1a3fbf39e20ab5242e9aad10a5203b801b818d14f252de428107f22771806356085c128a669cd9ddfbb52089da9e42921b14c89f901b842a099"' : 'data-target="#xs-injectables-links-module-InsightsModule-11201c0a35b1c1a3fbf39e20ab5242e9aad10a5203b801b818d14f252de428107f22771806356085c128a669cd9ddfbb52089da9e42921b14c89f901b842a099"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InsightsModule-11201c0a35b1c1a3fbf39e20ab5242e9aad10a5203b801b818d14f252de428107f22771806356085c128a669cd9ddfbb52089da9e42921b14c89f901b842a099"' :
                                        'id="xs-injectables-links-module-InsightsModule-11201c0a35b1c1a3fbf39e20ab5242e9aad10a5203b801b818d14f252de428107f22771806356085c128a669cd9ddfbb52089da9e42921b14c89f901b842a099"' }>
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
                                        'data-target="#injectables-links-module-UserModule-f7e134a659466e36639566ad40875418dd4b9381bfb04f757ccec7584d82bdbbd67a85696a1f34ff0280388255a78148432b14d7b3a2af2bf7769c599e560e30"' : 'data-target="#xs-injectables-links-module-UserModule-f7e134a659466e36639566ad40875418dd4b9381bfb04f757ccec7584d82bdbbd67a85696a1f34ff0280388255a78148432b14d7b3a2af2bf7769c599e560e30"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-f7e134a659466e36639566ad40875418dd4b9381bfb04f757ccec7584d82bdbbd67a85696a1f34ff0280388255a78148432b14d7b3a2af2bf7769c599e560e30"' :
                                        'id="xs-injectables-links-module-UserModule-f7e134a659466e36639566ad40875418dd4b9381bfb04f757ccec7584d82bdbbd67a85696a1f34ff0280388255a78148432b14d7b3a2af2bf7769c599e560e30"' }>
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