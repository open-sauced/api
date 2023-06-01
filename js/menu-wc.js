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
                                            'data-target="#controllers-links-module-ContributionModule-91a595b08f9429df4883a4b15f23ec3c5e55e873afb498b31a8d6f8fddded5d2a9b926c5ccd79fdc718542fd2d8f4779b0f37dc6941354bcf10000ee14b1e69a"' : 'data-target="#xs-controllers-links-module-ContributionModule-91a595b08f9429df4883a4b15f23ec3c5e55e873afb498b31a8d6f8fddded5d2a9b926c5ccd79fdc718542fd2d8f4779b0f37dc6941354bcf10000ee14b1e69a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ContributionModule-91a595b08f9429df4883a4b15f23ec3c5e55e873afb498b31a8d6f8fddded5d2a9b926c5ccd79fdc718542fd2d8f4779b0f37dc6941354bcf10000ee14b1e69a"' :
                                            'id="xs-controllers-links-module-ContributionModule-91a595b08f9429df4883a4b15f23ec3c5e55e873afb498b31a8d6f8fddded5d2a9b926c5ccd79fdc718542fd2d8f4779b0f37dc6941354bcf10000ee14b1e69a"' }>
                                            <li class="link">
                                                <a href="controllers/RepoContributionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoContributionsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ContributionModule-91a595b08f9429df4883a4b15f23ec3c5e55e873afb498b31a8d6f8fddded5d2a9b926c5ccd79fdc718542fd2d8f4779b0f37dc6941354bcf10000ee14b1e69a"' : 'data-target="#xs-injectables-links-module-ContributionModule-91a595b08f9429df4883a4b15f23ec3c5e55e873afb498b31a8d6f8fddded5d2a9b926c5ccd79fdc718542fd2d8f4779b0f37dc6941354bcf10000ee14b1e69a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ContributionModule-91a595b08f9429df4883a4b15f23ec3c5e55e873afb498b31a8d6f8fddded5d2a9b926c5ccd79fdc718542fd2d8f4779b0f37dc6941354bcf10000ee14b1e69a"' :
                                        'id="xs-injectables-links-module-ContributionModule-91a595b08f9429df4883a4b15f23ec3c5e55e873afb498b31a8d6f8fddded5d2a9b926c5ccd79fdc718542fd2d8f4779b0f37dc6941354bcf10000ee14b1e69a"' }>
                                        <li class="link">
                                            <a href="injectables/ContributionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContributionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ContributorModule.html" data-type="entity-link" >ContributorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ContributorModule-74c4ed5e0487366945464b963ee864138a287edf465dc3365d355bd872988b1f575e0d6298d1c0c4f7c29a63255b98fa3749277118ce872011523e793c68d950"' : 'data-target="#xs-controllers-links-module-ContributorModule-74c4ed5e0487366945464b963ee864138a287edf465dc3365d355bd872988b1f575e0d6298d1c0c4f7c29a63255b98fa3749277118ce872011523e793c68d950"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ContributorModule-74c4ed5e0487366945464b963ee864138a287edf465dc3365d355bd872988b1f575e0d6298d1c0c4f7c29a63255b98fa3749277118ce872011523e793c68d950"' :
                                            'id="xs-controllers-links-module-ContributorModule-74c4ed5e0487366945464b963ee864138a287edf465dc3365d355bd872988b1f575e0d6298d1c0c4f7c29a63255b98fa3749277118ce872011523e793c68d950"' }>
                                            <li class="link">
                                                <a href="controllers/ContributorController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContributorController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CustomerModule.html" data-type="entity-link" >CustomerModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CustomerModule-5b264a2494e634a055a9bb62b2ddc9f0f53017ae1103070d98d8c813aa5d4afdbec285b35e24ff981757c506858f86c0b66c18a2b5a63e50342cb5ff9ad5ed9c"' : 'data-target="#xs-injectables-links-module-CustomerModule-5b264a2494e634a055a9bb62b2ddc9f0f53017ae1103070d98d8c813aa5d4afdbec285b35e24ff981757c506858f86c0b66c18a2b5a63e50342cb5ff9ad5ed9c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CustomerModule-5b264a2494e634a055a9bb62b2ddc9f0f53017ae1103070d98d8c813aa5d4afdbec285b35e24ff981757c506858f86c0b66c18a2b5a63e50342cb5ff9ad5ed9c"' :
                                        'id="xs-injectables-links-module-CustomerModule-5b264a2494e634a055a9bb62b2ddc9f0f53017ae1103070d98d8c813aa5d4afdbec285b35e24ff981757c506858f86c0b66c18a2b5a63e50342cb5ff9ad5ed9c"' }>
                                        <li class="link">
                                            <a href="injectables/CustomerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EmojiModule.html" data-type="entity-link" >EmojiModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-EmojiModule-578717cbe0642b86e772a0c1171b11aae3f503f83dd64cd68172a9abc78a61d42e182750481ac36ae26d2c0d925d45e3a804a4a51d311329986746f28701f887"' : 'data-target="#xs-controllers-links-module-EmojiModule-578717cbe0642b86e772a0c1171b11aae3f503f83dd64cd68172a9abc78a61d42e182750481ac36ae26d2c0d925d45e3a804a4a51d311329986746f28701f887"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EmojiModule-578717cbe0642b86e772a0c1171b11aae3f503f83dd64cd68172a9abc78a61d42e182750481ac36ae26d2c0d925d45e3a804a4a51d311329986746f28701f887"' :
                                            'id="xs-controllers-links-module-EmojiModule-578717cbe0642b86e772a0c1171b11aae3f503f83dd64cd68172a9abc78a61d42e182750481ac36ae26d2c0d925d45e3a804a4a51d311329986746f28701f887"' }>
                                            <li class="link">
                                                <a href="controllers/EmojiController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmojiController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EmojiModule-578717cbe0642b86e772a0c1171b11aae3f503f83dd64cd68172a9abc78a61d42e182750481ac36ae26d2c0d925d45e3a804a4a51d311329986746f28701f887"' : 'data-target="#xs-injectables-links-module-EmojiModule-578717cbe0642b86e772a0c1171b11aae3f503f83dd64cd68172a9abc78a61d42e182750481ac36ae26d2c0d925d45e3a804a4a51d311329986746f28701f887"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EmojiModule-578717cbe0642b86e772a0c1171b11aae3f503f83dd64cd68172a9abc78a61d42e182750481ac36ae26d2c0d925d45e3a804a4a51d311329986746f28701f887"' :
                                        'id="xs-injectables-links-module-EmojiModule-578717cbe0642b86e772a0c1171b11aae3f503f83dd64cd68172a9abc78a61d42e182750481ac36ae26d2c0d925d45e3a804a4a51d311329986746f28701f887"' }>
                                        <li class="link">
                                            <a href="injectables/EmojiService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmojiService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EndorsementModule.html" data-type="entity-link" >EndorsementModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-EndorsementModule-bb993661b41f00f47ee1bf0eab29d6eab2ca182004cfa49f7d35b4ce08a41ed4b7091f9e0a5b5f7024ae1ea7e1473eb21835dc0e08037d8830fcff758dff84eb"' : 'data-target="#xs-controllers-links-module-EndorsementModule-bb993661b41f00f47ee1bf0eab29d6eab2ca182004cfa49f7d35b4ce08a41ed4b7091f9e0a5b5f7024ae1ea7e1473eb21835dc0e08037d8830fcff758dff84eb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EndorsementModule-bb993661b41f00f47ee1bf0eab29d6eab2ca182004cfa49f7d35b4ce08a41ed4b7091f9e0a5b5f7024ae1ea7e1473eb21835dc0e08037d8830fcff758dff84eb"' :
                                            'id="xs-controllers-links-module-EndorsementModule-bb993661b41f00f47ee1bf0eab29d6eab2ca182004cfa49f7d35b4ce08a41ed4b7091f9e0a5b5f7024ae1ea7e1473eb21835dc0e08037d8830fcff758dff84eb"' }>
                                            <li class="link">
                                                <a href="controllers/EndorsementController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EndorsementController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EndorsementModule-bb993661b41f00f47ee1bf0eab29d6eab2ca182004cfa49f7d35b4ce08a41ed4b7091f9e0a5b5f7024ae1ea7e1473eb21835dc0e08037d8830fcff758dff84eb"' : 'data-target="#xs-injectables-links-module-EndorsementModule-bb993661b41f00f47ee1bf0eab29d6eab2ca182004cfa49f7d35b4ce08a41ed4b7091f9e0a5b5f7024ae1ea7e1473eb21835dc0e08037d8830fcff758dff84eb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EndorsementModule-bb993661b41f00f47ee1bf0eab29d6eab2ca182004cfa49f7d35b4ce08a41ed4b7091f9e0a5b5f7024ae1ea7e1473eb21835dc0e08037d8830fcff758dff84eb"' :
                                        'id="xs-injectables-links-module-EndorsementModule-bb993661b41f00f47ee1bf0eab29d6eab2ca182004cfa49f7d35b4ce08a41ed4b7091f9e0a5b5f7024ae1ea7e1473eb21835dc0e08037d8830fcff758dff84eb"' }>
                                        <li class="link">
                                            <a href="injectables/EndorsementService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EndorsementService</a>
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
                                <a href="modules/HighlightModule.html" data-type="entity-link" >HighlightModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-HighlightModule-29fa24dc37c95b0cb3b2054401b4d97edc1808d3668792dfae7bf90b9fde0308915ba60c6dc23fabfb8639a9729bc75f0c897ff41ca4ebfd42687aa521729712"' : 'data-target="#xs-controllers-links-module-HighlightModule-29fa24dc37c95b0cb3b2054401b4d97edc1808d3668792dfae7bf90b9fde0308915ba60c6dc23fabfb8639a9729bc75f0c897ff41ca4ebfd42687aa521729712"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HighlightModule-29fa24dc37c95b0cb3b2054401b4d97edc1808d3668792dfae7bf90b9fde0308915ba60c6dc23fabfb8639a9729bc75f0c897ff41ca4ebfd42687aa521729712"' :
                                            'id="xs-controllers-links-module-HighlightModule-29fa24dc37c95b0cb3b2054401b4d97edc1808d3668792dfae7bf90b9fde0308915ba60c6dc23fabfb8639a9729bc75f0c897ff41ca4ebfd42687aa521729712"' }>
                                            <li class="link">
                                                <a href="controllers/HighlightController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HighlightController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InsightsModule.html" data-type="entity-link" >InsightsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-InsightsModule-849a88fe15fe1c00253126ce025c7b305cbc2320e809e93f85d2aefb996c719b1747f619c6b7b4f6400ca44677f9166efae4984397217155af81996b82d9ecc2"' : 'data-target="#xs-controllers-links-module-InsightsModule-849a88fe15fe1c00253126ce025c7b305cbc2320e809e93f85d2aefb996c719b1747f619c6b7b4f6400ca44677f9166efae4984397217155af81996b82d9ecc2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-InsightsModule-849a88fe15fe1c00253126ce025c7b305cbc2320e809e93f85d2aefb996c719b1747f619c6b7b4f6400ca44677f9166efae4984397217155af81996b82d9ecc2"' :
                                            'id="xs-controllers-links-module-InsightsModule-849a88fe15fe1c00253126ce025c7b305cbc2320e809e93f85d2aefb996c719b1747f619c6b7b4f6400ca44677f9166efae4984397217155af81996b82d9ecc2"' }>
                                            <li class="link">
                                                <a href="controllers/InsightController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InsightController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserInsightMemberController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserInsightMemberController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserInsightsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserInsightsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-InsightsModule-849a88fe15fe1c00253126ce025c7b305cbc2320e809e93f85d2aefb996c719b1747f619c6b7b4f6400ca44677f9166efae4984397217155af81996b82d9ecc2"' : 'data-target="#xs-injectables-links-module-InsightsModule-849a88fe15fe1c00253126ce025c7b305cbc2320e809e93f85d2aefb996c719b1747f619c6b7b4f6400ca44677f9166efae4984397217155af81996b82d9ecc2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InsightsModule-849a88fe15fe1c00253126ce025c7b305cbc2320e809e93f85d2aefb996c719b1747f619c6b7b4f6400ca44677f9166efae4984397217155af81996b82d9ecc2"' :
                                        'id="xs-injectables-links-module-InsightsModule-849a88fe15fe1c00253126ce025c7b305cbc2320e809e93f85d2aefb996c719b1747f619c6b7b4f6400ca44677f9166efae4984397217155af81996b82d9ecc2"' }>
                                        <li class="link">
                                            <a href="injectables/InsightMemberService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InsightMemberService</a>
                                        </li>
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
                                <a href="modules/LogModule.html" data-type="entity-link" >LogModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LogModule-65597c83d278ad1e756037ecce79da291d02196021312fa0ddb28e66297773efddc0378f1df884960157d5d382c61d8dd9079e2274db455a9190791a825c2d6e"' : 'data-target="#xs-injectables-links-module-LogModule-65597c83d278ad1e756037ecce79da291d02196021312fa0ddb28e66297773efddc0378f1df884960157d5d382c61d8dd9079e2274db455a9190791a825c2d6e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LogModule-65597c83d278ad1e756037ecce79da291d02196021312fa0ddb28e66297773efddc0378f1df884960157d5d382c61d8dd9079e2274db455a9190791a825c2d6e"' :
                                        'id="xs-injectables-links-module-LogModule-65597c83d278ad1e756037ecce79da291d02196021312fa0ddb28e66297773efddc0378f1df884960157d5d382c61d8dd9079e2274db455a9190791a825c2d6e"' }>
                                        <li class="link">
                                            <a href="injectables/CustomLogger.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomLogger</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PullRequestModule.html" data-type="entity-link" >PullRequestModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PullRequestModule-be69c8097c94283c18650d76168795d8f7d17ca7c8c635c25737d78a3ae3a7a73445fed84e7534692840a754b236b08e247d6146ab9ff19f02812013e32fd0a8"' : 'data-target="#xs-controllers-links-module-PullRequestModule-be69c8097c94283c18650d76168795d8f7d17ca7c8c635c25737d78a3ae3a7a73445fed84e7534692840a754b236b08e247d6146ab9ff19f02812013e32fd0a8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PullRequestModule-be69c8097c94283c18650d76168795d8f7d17ca7c8c635c25737d78a3ae3a7a73445fed84e7534692840a754b236b08e247d6146ab9ff19f02812013e32fd0a8"' :
                                            'id="xs-controllers-links-module-PullRequestModule-be69c8097c94283c18650d76168795d8f7d17ca7c8c635c25737d78a3ae3a7a73445fed84e7534692840a754b236b08e247d6146ab9ff19f02812013e32fd0a8"' }>
                                            <li class="link">
                                                <a href="controllers/CodeRefactorSuggestionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodeRefactorSuggestionController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PullRequestController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PullRequestDescriptionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestDescriptionController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PullRequestModule-be69c8097c94283c18650d76168795d8f7d17ca7c8c635c25737d78a3ae3a7a73445fed84e7534692840a754b236b08e247d6146ab9ff19f02812013e32fd0a8"' : 'data-target="#xs-injectables-links-module-PullRequestModule-be69c8097c94283c18650d76168795d8f7d17ca7c8c635c25737d78a3ae3a7a73445fed84e7534692840a754b236b08e247d6146ab9ff19f02812013e32fd0a8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PullRequestModule-be69c8097c94283c18650d76168795d8f7d17ca7c8c635c25737d78a3ae3a7a73445fed84e7534692840a754b236b08e247d6146ab9ff19f02812013e32fd0a8"' :
                                        'id="xs-injectables-links-module-PullRequestModule-be69c8097c94283c18650d76168795d8f7d17ca7c8c635c25737d78a3ae3a7a73445fed84e7534692840a754b236b08e247d6146ab9ff19f02812013e32fd0a8"' }>
                                        <li class="link">
                                            <a href="injectables/CodeRefactorSuggestionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodeRefactorSuggestionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PullRequestDescriptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestDescriptionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PullRequestInsightsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestInsightsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PullRequestService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RepoFilterModule.html" data-type="entity-link" >RepoFilterModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RepoFilterModule-97bee53a3faf57aa7c3be1837ca4e562914c8bd650d6620c7eec5cb8b213d388c11d868f05bf85feac6f6a43cf32c30fb95bccc89f1e1d1672acc73bb5161eba"' : 'data-target="#xs-injectables-links-module-RepoFilterModule-97bee53a3faf57aa7c3be1837ca4e562914c8bd650d6620c7eec5cb8b213d388c11d868f05bf85feac6f6a43cf32c30fb95bccc89f1e1d1672acc73bb5161eba"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RepoFilterModule-97bee53a3faf57aa7c3be1837ca4e562914c8bd650d6620c7eec5cb8b213d388c11d868f05bf85feac6f6a43cf32c30fb95bccc89f1e1d1672acc73bb5161eba"' :
                                        'id="xs-injectables-links-module-RepoFilterModule-97bee53a3faf57aa7c3be1837ca4e562914c8bd650d6620c7eec5cb8b213d388c11d868f05bf85feac6f6a43cf32c30fb95bccc89f1e1d1672acc73bb5161eba"' }>
                                        <li class="link">
                                            <a href="injectables/RepoFilterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoFilterService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RepoModule.html" data-type="entity-link" >RepoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-RepoModule-9e1c4001acbd0209c587058c4e6fe4be2a1b05499849e0c9488fc28264930bcac92b2aa6b7ee2d30f22c042004fb74dd95a96d672c081185acbf9e973feb5250"' : 'data-target="#xs-controllers-links-module-RepoModule-9e1c4001acbd0209c587058c4e6fe4be2a1b05499849e0c9488fc28264930bcac92b2aa6b7ee2d30f22c042004fb74dd95a96d672c081185acbf9e973feb5250"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RepoModule-9e1c4001acbd0209c587058c4e6fe4be2a1b05499849e0c9488fc28264930bcac92b2aa6b7ee2d30f22c042004fb74dd95a96d672c081185acbf9e973feb5250"' :
                                            'id="xs-controllers-links-module-RepoModule-9e1c4001acbd0209c587058c4e6fe4be2a1b05499849e0c9488fc28264930bcac92b2aa6b7ee2d30f22c042004fb74dd95a96d672c081185acbf9e973feb5250"' }>
                                            <li class="link">
                                                <a href="controllers/RepoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RepoModule-9e1c4001acbd0209c587058c4e6fe4be2a1b05499849e0c9488fc28264930bcac92b2aa6b7ee2d30f22c042004fb74dd95a96d672c081185acbf9e973feb5250"' : 'data-target="#xs-injectables-links-module-RepoModule-9e1c4001acbd0209c587058c4e6fe4be2a1b05499849e0c9488fc28264930bcac92b2aa6b7ee2d30f22c042004fb74dd95a96d672c081185acbf9e973feb5250"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RepoModule-9e1c4001acbd0209c587058c4e6fe4be2a1b05499849e0c9488fc28264930bcac92b2aa6b7ee2d30f22c042004fb74dd95a96d672c081185acbf9e973feb5250"' :
                                        'id="xs-injectables-links-module-RepoModule-9e1c4001acbd0209c587058c4e6fe4be2a1b05499849e0c9488fc28264930bcac92b2aa6b7ee2d30f22c042004fb74dd95a96d672c081185acbf9e973feb5250"' }>
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
                                            'data-target="#controllers-links-module-StargazeModule-6dffde29ca92d5529281ac7b09837376d6588ff32754f8590a5e64d716a293248a3ecc0d9f502e2d52e916015611cb4b7fc01305f6a0b99661ce4d2ff63254ee"' : 'data-target="#xs-controllers-links-module-StargazeModule-6dffde29ca92d5529281ac7b09837376d6588ff32754f8590a5e64d716a293248a3ecc0d9f502e2d52e916015611cb4b7fc01305f6a0b99661ce4d2ff63254ee"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StargazeModule-6dffde29ca92d5529281ac7b09837376d6588ff32754f8590a5e64d716a293248a3ecc0d9f502e2d52e916015611cb4b7fc01305f6a0b99661ce4d2ff63254ee"' :
                                            'id="xs-controllers-links-module-StargazeModule-6dffde29ca92d5529281ac7b09837376d6588ff32754f8590a5e64d716a293248a3ecc0d9f502e2d52e916015611cb4b7fc01305f6a0b99661ce4d2ff63254ee"' }>
                                            <li class="link">
                                                <a href="controllers/RepoStargazeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoStargazeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StargazeModule-6dffde29ca92d5529281ac7b09837376d6588ff32754f8590a5e64d716a293248a3ecc0d9f502e2d52e916015611cb4b7fc01305f6a0b99661ce4d2ff63254ee"' : 'data-target="#xs-injectables-links-module-StargazeModule-6dffde29ca92d5529281ac7b09837376d6588ff32754f8590a5e64d716a293248a3ecc0d9f502e2d52e916015611cb4b7fc01305f6a0b99661ce4d2ff63254ee"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StargazeModule-6dffde29ca92d5529281ac7b09837376d6588ff32754f8590a5e64d716a293248a3ecc0d9f502e2d52e916015611cb4b7fc01305f6a0b99661ce4d2ff63254ee"' :
                                        'id="xs-injectables-links-module-StargazeModule-6dffde29ca92d5529281ac7b09837376d6588ff32754f8590a5e64d716a293248a3ecc0d9f502e2d52e916015611cb4b7fc01305f6a0b99661ce4d2ff63254ee"' }>
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
                                            'data-target="#controllers-links-module-StarModule-12823231d216d557c32a73176c47530cffa52d56caff6b2109174fd6d84880d7ed0721cf5c793ace01b26ee61171a377ddc7d7a4c3e40a236da91d7de0ec20ec"' : 'data-target="#xs-controllers-links-module-StarModule-12823231d216d557c32a73176c47530cffa52d56caff6b2109174fd6d84880d7ed0721cf5c793ace01b26ee61171a377ddc7d7a4c3e40a236da91d7de0ec20ec"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StarModule-12823231d216d557c32a73176c47530cffa52d56caff6b2109174fd6d84880d7ed0721cf5c793ace01b26ee61171a377ddc7d7a4c3e40a236da91d7de0ec20ec"' :
                                            'id="xs-controllers-links-module-StarModule-12823231d216d557c32a73176c47530cffa52d56caff6b2109174fd6d84880d7ed0721cf5c793ace01b26ee61171a377ddc7d7a4c3e40a236da91d7de0ec20ec"' }>
                                            <li class="link">
                                                <a href="controllers/RepoStarController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoStarController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StarModule-12823231d216d557c32a73176c47530cffa52d56caff6b2109174fd6d84880d7ed0721cf5c793ace01b26ee61171a377ddc7d7a4c3e40a236da91d7de0ec20ec"' : 'data-target="#xs-injectables-links-module-StarModule-12823231d216d557c32a73176c47530cffa52d56caff6b2109174fd6d84880d7ed0721cf5c793ace01b26ee61171a377ddc7d7a4c3e40a236da91d7de0ec20ec"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StarModule-12823231d216d557c32a73176c47530cffa52d56caff6b2109174fd6d84880d7ed0721cf5c793ace01b26ee61171a377ddc7d7a4c3e40a236da91d7de0ec20ec"' :
                                        'id="xs-injectables-links-module-StarModule-12823231d216d557c32a73176c47530cffa52d56caff6b2109174fd6d84880d7ed0721cf5c793ace01b26ee61171a377ddc7d7a4c3e40a236da91d7de0ec20ec"' }>
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
                                        'data-target="#injectables-links-module-StripeSubscriptionModule-960e7736f0a394d6c4b4e2ff39dc4c396c92fdd60b4227eacb98d531b58b1ff86a7cb97e801937ed108da75bee3c57271e45f7279fda389a6ce37bc84aa8b8e7"' : 'data-target="#xs-injectables-links-module-StripeSubscriptionModule-960e7736f0a394d6c4b4e2ff39dc4c396c92fdd60b4227eacb98d531b58b1ff86a7cb97e801937ed108da75bee3c57271e45f7279fda389a6ce37bc84aa8b8e7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StripeSubscriptionModule-960e7736f0a394d6c4b4e2ff39dc4c396c92fdd60b4227eacb98d531b58b1ff86a7cb97e801937ed108da75bee3c57271e45f7279fda389a6ce37bc84aa8b8e7"' :
                                        'id="xs-injectables-links-module-StripeSubscriptionModule-960e7736f0a394d6c4b4e2ff39dc4c396c92fdd60b4227eacb98d531b58b1ff86a7cb97e801937ed108da75bee3c57271e45f7279fda389a6ce37bc84aa8b8e7"' }>
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
                                            'data-target="#controllers-links-module-SubmitModule-0913141d4b1cff95e4bd3dd38a3b7c83e94c6bb7c34604be06a343cd57fd2d64bb85cdd69d178a5edef93b222ef0c1935e49da4cc3e34ff531e93be34eec453e"' : 'data-target="#xs-controllers-links-module-SubmitModule-0913141d4b1cff95e4bd3dd38a3b7c83e94c6bb7c34604be06a343cd57fd2d64bb85cdd69d178a5edef93b222ef0c1935e49da4cc3e34ff531e93be34eec453e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SubmitModule-0913141d4b1cff95e4bd3dd38a3b7c83e94c6bb7c34604be06a343cd57fd2d64bb85cdd69d178a5edef93b222ef0c1935e49da4cc3e34ff531e93be34eec453e"' :
                                            'id="xs-controllers-links-module-SubmitModule-0913141d4b1cff95e4bd3dd38a3b7c83e94c6bb7c34604be06a343cd57fd2d64bb85cdd69d178a5edef93b222ef0c1935e49da4cc3e34ff531e93be34eec453e"' }>
                                            <li class="link">
                                                <a href="controllers/RepoSubmitController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoSubmitController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SubmitModule-0913141d4b1cff95e4bd3dd38a3b7c83e94c6bb7c34604be06a343cd57fd2d64bb85cdd69d178a5edef93b222ef0c1935e49da4cc3e34ff531e93be34eec453e"' : 'data-target="#xs-injectables-links-module-SubmitModule-0913141d4b1cff95e4bd3dd38a3b7c83e94c6bb7c34604be06a343cd57fd2d64bb85cdd69d178a5edef93b222ef0c1935e49da4cc3e34ff531e93be34eec453e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SubmitModule-0913141d4b1cff95e4bd3dd38a3b7c83e94c6bb7c34604be06a343cd57fd2d64bb85cdd69d178a5edef93b222ef0c1935e49da4cc3e34ff531e93be34eec453e"' :
                                        'id="xs-injectables-links-module-SubmitModule-0913141d4b1cff95e4bd3dd38a3b7c83e94c6bb7c34604be06a343cd57fd2d64bb85cdd69d178a5edef93b222ef0c1935e49da4cc3e34ff531e93be34eec453e"' }>
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
                                            'data-target="#controllers-links-module-UserModule-3f543778f979305d877110cb3b18355476bc7927305ac19bdfceb7069aaa6cc0f134e3515ffa92646383dbf5b911b7c7663c4abdbe2d92bfcc9127c9cc91c1c9"' : 'data-target="#xs-controllers-links-module-UserModule-3f543778f979305d877110cb3b18355476bc7927305ac19bdfceb7069aaa6cc0f134e3515ffa92646383dbf5b911b7c7663c4abdbe2d92bfcc9127c9cc91c1c9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-3f543778f979305d877110cb3b18355476bc7927305ac19bdfceb7069aaa6cc0f134e3515ffa92646383dbf5b911b7c7663c4abdbe2d92bfcc9127c9cc91c1c9"' :
                                            'id="xs-controllers-links-module-UserModule-3f543778f979305d877110cb3b18355476bc7927305ac19bdfceb7069aaa6cc0f134e3515ffa92646383dbf5b911b7c7663c4abdbe2d92bfcc9127c9cc91c1c9"' }>
                                            <li class="link">
                                                <a href="controllers/UserCollaborationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserCollaborationController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserEndorsementController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserEndorsementController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserFollowsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserFollowsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserHighlightsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserHighlightsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserNotificationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserNotificationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-3f543778f979305d877110cb3b18355476bc7927305ac19bdfceb7069aaa6cc0f134e3515ffa92646383dbf5b911b7c7663c4abdbe2d92bfcc9127c9cc91c1c9"' : 'data-target="#xs-injectables-links-module-UserModule-3f543778f979305d877110cb3b18355476bc7927305ac19bdfceb7069aaa6cc0f134e3515ffa92646383dbf5b911b7c7663c4abdbe2d92bfcc9127c9cc91c1c9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-3f543778f979305d877110cb3b18355476bc7927305ac19bdfceb7069aaa6cc0f134e3515ffa92646383dbf5b911b7c7663c4abdbe2d92bfcc9127c9cc91c1c9"' :
                                        'id="xs-injectables-links-module-UserModule-3f543778f979305d877110cb3b18355476bc7927305ac19bdfceb7069aaa6cc0f134e3515ffa92646383dbf5b911b7c7663c4abdbe2d92bfcc9127c9cc91c1c9"' }>
                                        <li class="link">
                                            <a href="injectables/EndorsementService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EndorsementService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RepoFilterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoFilterService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RepoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserCollaborationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserCollaborationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserFollowService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserFollowService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserHighlightsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserHighlightsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserNotificationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserNotificationService</a>
                                        </li>
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
                                        'data-target="#injectables-links-module-UserReposModule-863b022d8691e19556eb1614f3d8a1a6eb3cb183e2989c27bd49fc27e89109503eeb75ac549ecd7331cf0752cf5fc296ed8b03edcaaca3914c084766fcb570a2"' : 'data-target="#xs-injectables-links-module-UserReposModule-863b022d8691e19556eb1614f3d8a1a6eb3cb183e2989c27bd49fc27e89109503eeb75ac549ecd7331cf0752cf5fc296ed8b03edcaaca3914c084766fcb570a2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserReposModule-863b022d8691e19556eb1614f3d8a1a6eb3cb183e2989c27bd49fc27e89109503eeb75ac549ecd7331cf0752cf5fc296ed8b03edcaaca3914c084766fcb570a2"' :
                                        'id="xs-injectables-links-module-UserReposModule-863b022d8691e19556eb1614f3d8a1a6eb3cb183e2989c27bd49fc27e89109503eeb75ac549ecd7331cf0752cf5fc296ed8b03edcaaca3914c084766fcb570a2"' }>
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
                                            'data-target="#controllers-links-module-VoteModule-8dcd500a1ea0c866c4c2fe1f8639d832c7fc0e1f68c09bf6f971916cf17f45444da12b4f43da3faeecf86f125af1ef73857e97f2e86972b0e410c9cc9bc075c0"' : 'data-target="#xs-controllers-links-module-VoteModule-8dcd500a1ea0c866c4c2fe1f8639d832c7fc0e1f68c09bf6f971916cf17f45444da12b4f43da3faeecf86f125af1ef73857e97f2e86972b0e410c9cc9bc075c0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-VoteModule-8dcd500a1ea0c866c4c2fe1f8639d832c7fc0e1f68c09bf6f971916cf17f45444da12b4f43da3faeecf86f125af1ef73857e97f2e86972b0e410c9cc9bc075c0"' :
                                            'id="xs-controllers-links-module-VoteModule-8dcd500a1ea0c866c4c2fe1f8639d832c7fc0e1f68c09bf6f971916cf17f45444da12b4f43da3faeecf86f125af1ef73857e97f2e86972b0e410c9cc9bc075c0"' }>
                                            <li class="link">
                                                <a href="controllers/RepoVoteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoVoteController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-VoteModule-8dcd500a1ea0c866c4c2fe1f8639d832c7fc0e1f68c09bf6f971916cf17f45444da12b4f43da3faeecf86f125af1ef73857e97f2e86972b0e410c9cc9bc075c0"' : 'data-target="#xs-injectables-links-module-VoteModule-8dcd500a1ea0c866c4c2fe1f8639d832c7fc0e1f68c09bf6f971916cf17f45444da12b4f43da3faeecf86f125af1ef73857e97f2e86972b0e410c9cc9bc075c0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VoteModule-8dcd500a1ea0c866c4c2fe1f8639d832c7fc0e1f68c09bf6f971916cf17f45444da12b4f43da3faeecf86f125af1ef73857e97f2e86972b0e410c9cc9bc075c0"' :
                                        'id="xs-injectables-links-module-VoteModule-8dcd500a1ea0c866c4c2fe1f8639d832c7fc0e1f68c09bf6f971916cf17f45444da12b4f43da3faeecf86f125af1ef73857e97f2e86972b0e410c9cc9bc075c0"' }>
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
                                    <a href="entities/DbEmoji.html" data-type="entity-link" >DbEmoji</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbEndorsement.html" data-type="entity-link" >DbEndorsement</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbInsight.html" data-type="entity-link" >DbInsight</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbInsightMember.html" data-type="entity-link" >DbInsightMember</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbInsightRepo.html" data-type="entity-link" >DbInsightRepo</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbLog.html" data-type="entity-link" >DbLog</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbPRInsight.html" data-type="entity-link" >DbPRInsight</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbPullRequest.html" data-type="entity-link" >DbPullRequest</a>
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
                                    <a href="entities/DbUserCollaboration.html" data-type="entity-link" >DbUserCollaboration</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbUserHighlight.html" data-type="entity-link" >DbUserHighlight</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbUserHighlightReaction.html" data-type="entity-link" >DbUserHighlightReaction</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbUserNotification.html" data-type="entity-link" >DbUserNotification</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbUserRepo.html" data-type="entity-link" >DbUserRepo</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbUserTopRepo.html" data-type="entity-link" >DbUserTopRepo</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbUserToUserFollows.html" data-type="entity-link" >DbUserToUserFollows</a>
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
                                <a href="classes/CreateEndorsementDto.html" data-type="entity-link" >CreateEndorsementDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateInsightDto.html" data-type="entity-link" >CreateInsightDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateInsightMemberDto.html" data-type="entity-link" >CreateInsightMemberDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateLogDto.html" data-type="entity-link" >CreateLogDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserCollaborationDto.html" data-type="entity-link" >CreateUserCollaborationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserHighlightDto.html" data-type="entity-link" >CreateUserHighlightDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseLoggerMiddleware.html" data-type="entity-link" >DatabaseLoggerMiddleware</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbPullRequestContributor.html" data-type="entity-link" >DbPullRequestContributor</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbUserHighlightRepo.html" data-type="entity-link" >DbUserHighlightRepo</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterOptionsDto.html" data-type="entity-link" >FilterOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenerateCodeRefactorSuggestionDto.html" data-type="entity-link" >GenerateCodeRefactorSuggestionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeneratePullRequestDescriptionDto.html" data-type="entity-link" >GeneratePullRequestDescriptionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/HighlightOptionsDto.html" data-type="entity-link" >HighlightOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InsightOptionsDto.html" data-type="entity-link" >InsightOptionsDto</a>
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
                                <a href="classes/PullRequestContributorOptionsDto.html" data-type="entity-link" >PullRequestContributorOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PullRequestPageOptionsDto.html" data-type="entity-link" >PullRequestPageOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepoInfo.html" data-type="entity-link" >RepoInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepoPageOptionsDto.html" data-type="entity-link" >RepoPageOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepoSearchOptionsDto.html" data-type="entity-link" >RepoSearchOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SupabaseAuthDto.html" data-type="entity-link" >SupabaseAuthDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEndorsementDto.html" data-type="entity-link" >UpdateEndorsementDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateInsightDto.html" data-type="entity-link" >UpdateInsightDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateInsightMemberDto.html" data-type="entity-link" >UpdateInsightMemberDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserCollaborationDto.html" data-type="entity-link" >UpdateUserCollaborationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserEmailPreferencesDto.html" data-type="entity-link" >UpdateUserEmailPreferencesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserProfileInterestsDto.html" data-type="entity-link" >UpdateUserProfileInterestsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserOnboardingDto.html" data-type="entity-link" >UserOnboardingDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRepoOptionsDto.html" data-type="entity-link" >UserRepoOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRepoOptionsDto-1.html" data-type="entity-link" >UserRepoOptionsDto</a>
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
                                    <a href="injectables/CustomLogger.html" data-type="entity-link" >CustomLogger</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpLoggerMiddleware.html" data-type="entity-link" >HttpLoggerMiddleware</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/EndorsementTokenGuard.html" data-type="entity-link" >EndorsementTokenGuard</a>
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
                                <a href="interfaces/ChatResponse.html" data-type="entity-link" >ChatResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatResponse-1.html" data-type="entity-link" >ChatResponse</a>
                            </li>
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