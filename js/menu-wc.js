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
                                            'data-target="#controllers-links-module-ContributionModule-1187d88049b13359c9b06a7618b9f01057e910876bfecaceef01b4fab2958d394478169d70ffa25a2023c2560b845894fa56fa8651fde56a5ec350cd8fd44394"' : 'data-target="#xs-controllers-links-module-ContributionModule-1187d88049b13359c9b06a7618b9f01057e910876bfecaceef01b4fab2958d394478169d70ffa25a2023c2560b845894fa56fa8651fde56a5ec350cd8fd44394"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ContributionModule-1187d88049b13359c9b06a7618b9f01057e910876bfecaceef01b4fab2958d394478169d70ffa25a2023c2560b845894fa56fa8651fde56a5ec350cd8fd44394"' :
                                            'id="xs-controllers-links-module-ContributionModule-1187d88049b13359c9b06a7618b9f01057e910876bfecaceef01b4fab2958d394478169d70ffa25a2023c2560b845894fa56fa8651fde56a5ec350cd8fd44394"' }>
                                            <li class="link">
                                                <a href="controllers/RepoContributionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoContributionsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ContributionModule-1187d88049b13359c9b06a7618b9f01057e910876bfecaceef01b4fab2958d394478169d70ffa25a2023c2560b845894fa56fa8651fde56a5ec350cd8fd44394"' : 'data-target="#xs-injectables-links-module-ContributionModule-1187d88049b13359c9b06a7618b9f01057e910876bfecaceef01b4fab2958d394478169d70ffa25a2023c2560b845894fa56fa8651fde56a5ec350cd8fd44394"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ContributionModule-1187d88049b13359c9b06a7618b9f01057e910876bfecaceef01b4fab2958d394478169d70ffa25a2023c2560b845894fa56fa8651fde56a5ec350cd8fd44394"' :
                                        'id="xs-injectables-links-module-ContributionModule-1187d88049b13359c9b06a7618b9f01057e910876bfecaceef01b4fab2958d394478169d70ffa25a2023c2560b845894fa56fa8651fde56a5ec350cd8fd44394"' }>
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
                                            'data-target="#controllers-links-module-InsightsModule-59bfd71adf2c7da0f1110ac46c1a71fd90e8f7fe826718af558befe2afe24c59548297ace80240d3a310f5f4b4dcbd6355bc8003d34e14b81f07ee765548345f"' : 'data-target="#xs-controllers-links-module-InsightsModule-59bfd71adf2c7da0f1110ac46c1a71fd90e8f7fe826718af558befe2afe24c59548297ace80240d3a310f5f4b4dcbd6355bc8003d34e14b81f07ee765548345f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-InsightsModule-59bfd71adf2c7da0f1110ac46c1a71fd90e8f7fe826718af558befe2afe24c59548297ace80240d3a310f5f4b4dcbd6355bc8003d34e14b81f07ee765548345f"' :
                                            'id="xs-controllers-links-module-InsightsModule-59bfd71adf2c7da0f1110ac46c1a71fd90e8f7fe826718af558befe2afe24c59548297ace80240d3a310f5f4b4dcbd6355bc8003d34e14b81f07ee765548345f"' }>
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
                                        'data-target="#injectables-links-module-InsightsModule-59bfd71adf2c7da0f1110ac46c1a71fd90e8f7fe826718af558befe2afe24c59548297ace80240d3a310f5f4b4dcbd6355bc8003d34e14b81f07ee765548345f"' : 'data-target="#xs-injectables-links-module-InsightsModule-59bfd71adf2c7da0f1110ac46c1a71fd90e8f7fe826718af558befe2afe24c59548297ace80240d3a310f5f4b4dcbd6355bc8003d34e14b81f07ee765548345f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InsightsModule-59bfd71adf2c7da0f1110ac46c1a71fd90e8f7fe826718af558befe2afe24c59548297ace80240d3a310f5f4b4dcbd6355bc8003d34e14b81f07ee765548345f"' :
                                        'id="xs-injectables-links-module-InsightsModule-59bfd71adf2c7da0f1110ac46c1a71fd90e8f7fe826718af558befe2afe24c59548297ace80240d3a310f5f4b4dcbd6355bc8003d34e14b81f07ee765548345f"' }>
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
                                            'data-target="#controllers-links-module-PullRequestModule-71c3fa143f7202f95e1a83209fceda88d5d85ade6dcd0ca6419afdd4ea5c7357ff97fb71f57c841ab0cc1ec50294be053fffa06ce407031c8b83ab38706ae239"' : 'data-target="#xs-controllers-links-module-PullRequestModule-71c3fa143f7202f95e1a83209fceda88d5d85ade6dcd0ca6419afdd4ea5c7357ff97fb71f57c841ab0cc1ec50294be053fffa06ce407031c8b83ab38706ae239"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PullRequestModule-71c3fa143f7202f95e1a83209fceda88d5d85ade6dcd0ca6419afdd4ea5c7357ff97fb71f57c841ab0cc1ec50294be053fffa06ce407031c8b83ab38706ae239"' :
                                            'id="xs-controllers-links-module-PullRequestModule-71c3fa143f7202f95e1a83209fceda88d5d85ade6dcd0ca6419afdd4ea5c7357ff97fb71f57c841ab0cc1ec50294be053fffa06ce407031c8b83ab38706ae239"' }>
                                            <li class="link">
                                                <a href="controllers/PullRequestController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PullRequestModule-71c3fa143f7202f95e1a83209fceda88d5d85ade6dcd0ca6419afdd4ea5c7357ff97fb71f57c841ab0cc1ec50294be053fffa06ce407031c8b83ab38706ae239"' : 'data-target="#xs-injectables-links-module-PullRequestModule-71c3fa143f7202f95e1a83209fceda88d5d85ade6dcd0ca6419afdd4ea5c7357ff97fb71f57c841ab0cc1ec50294be053fffa06ce407031c8b83ab38706ae239"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PullRequestModule-71c3fa143f7202f95e1a83209fceda88d5d85ade6dcd0ca6419afdd4ea5c7357ff97fb71f57c841ab0cc1ec50294be053fffa06ce407031c8b83ab38706ae239"' :
                                        'id="xs-injectables-links-module-PullRequestModule-71c3fa143f7202f95e1a83209fceda88d5d85ade6dcd0ca6419afdd4ea5c7357ff97fb71f57c841ab0cc1ec50294be053fffa06ce407031c8b83ab38706ae239"' }>
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
                                            'data-target="#controllers-links-module-RepoModule-bb6b987701eec7369bdb7f09061470c41a7c0db5e4f1ab93fdcbcc34050fa571ab86b489db8d56a84c2d72c5a1bd6414d1802e2fbe00a5e7897bfcaf23275e1d"' : 'data-target="#xs-controllers-links-module-RepoModule-bb6b987701eec7369bdb7f09061470c41a7c0db5e4f1ab93fdcbcc34050fa571ab86b489db8d56a84c2d72c5a1bd6414d1802e2fbe00a5e7897bfcaf23275e1d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RepoModule-bb6b987701eec7369bdb7f09061470c41a7c0db5e4f1ab93fdcbcc34050fa571ab86b489db8d56a84c2d72c5a1bd6414d1802e2fbe00a5e7897bfcaf23275e1d"' :
                                            'id="xs-controllers-links-module-RepoModule-bb6b987701eec7369bdb7f09061470c41a7c0db5e4f1ab93fdcbcc34050fa571ab86b489db8d56a84c2d72c5a1bd6414d1802e2fbe00a5e7897bfcaf23275e1d"' }>
                                            <li class="link">
                                                <a href="controllers/RepoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RepoModule-bb6b987701eec7369bdb7f09061470c41a7c0db5e4f1ab93fdcbcc34050fa571ab86b489db8d56a84c2d72c5a1bd6414d1802e2fbe00a5e7897bfcaf23275e1d"' : 'data-target="#xs-injectables-links-module-RepoModule-bb6b987701eec7369bdb7f09061470c41a7c0db5e4f1ab93fdcbcc34050fa571ab86b489db8d56a84c2d72c5a1bd6414d1802e2fbe00a5e7897bfcaf23275e1d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RepoModule-bb6b987701eec7369bdb7f09061470c41a7c0db5e4f1ab93fdcbcc34050fa571ab86b489db8d56a84c2d72c5a1bd6414d1802e2fbe00a5e7897bfcaf23275e1d"' :
                                        'id="xs-injectables-links-module-RepoModule-bb6b987701eec7369bdb7f09061470c41a7c0db5e4f1ab93fdcbcc34050fa571ab86b489db8d56a84c2d72c5a1bd6414d1802e2fbe00a5e7897bfcaf23275e1d"' }>
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
                                            'data-target="#controllers-links-module-StargazeModule-dee2c1a921bee22536ddd5b5f4851671f74515a29c474d03b402316fef8793cc90437c65120e48ed5eb8e4b056f8fe3179fd098e52d971f72b13f3b50340bea8"' : 'data-target="#xs-controllers-links-module-StargazeModule-dee2c1a921bee22536ddd5b5f4851671f74515a29c474d03b402316fef8793cc90437c65120e48ed5eb8e4b056f8fe3179fd098e52d971f72b13f3b50340bea8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StargazeModule-dee2c1a921bee22536ddd5b5f4851671f74515a29c474d03b402316fef8793cc90437c65120e48ed5eb8e4b056f8fe3179fd098e52d971f72b13f3b50340bea8"' :
                                            'id="xs-controllers-links-module-StargazeModule-dee2c1a921bee22536ddd5b5f4851671f74515a29c474d03b402316fef8793cc90437c65120e48ed5eb8e4b056f8fe3179fd098e52d971f72b13f3b50340bea8"' }>
                                            <li class="link">
                                                <a href="controllers/RepoStargazeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoStargazeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StargazeModule-dee2c1a921bee22536ddd5b5f4851671f74515a29c474d03b402316fef8793cc90437c65120e48ed5eb8e4b056f8fe3179fd098e52d971f72b13f3b50340bea8"' : 'data-target="#xs-injectables-links-module-StargazeModule-dee2c1a921bee22536ddd5b5f4851671f74515a29c474d03b402316fef8793cc90437c65120e48ed5eb8e4b056f8fe3179fd098e52d971f72b13f3b50340bea8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StargazeModule-dee2c1a921bee22536ddd5b5f4851671f74515a29c474d03b402316fef8793cc90437c65120e48ed5eb8e4b056f8fe3179fd098e52d971f72b13f3b50340bea8"' :
                                        'id="xs-injectables-links-module-StargazeModule-dee2c1a921bee22536ddd5b5f4851671f74515a29c474d03b402316fef8793cc90437c65120e48ed5eb8e4b056f8fe3179fd098e52d971f72b13f3b50340bea8"' }>
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
                                            'data-target="#controllers-links-module-StarModule-4550cb278a4c6a0834b1ff887937bd7c9faefaf814fb631e61c483b23c8b142c8f4b1c25f56fb672e970702a640cc964d93a67f5e25940bfb493859ddd2d2e47"' : 'data-target="#xs-controllers-links-module-StarModule-4550cb278a4c6a0834b1ff887937bd7c9faefaf814fb631e61c483b23c8b142c8f4b1c25f56fb672e970702a640cc964d93a67f5e25940bfb493859ddd2d2e47"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StarModule-4550cb278a4c6a0834b1ff887937bd7c9faefaf814fb631e61c483b23c8b142c8f4b1c25f56fb672e970702a640cc964d93a67f5e25940bfb493859ddd2d2e47"' :
                                            'id="xs-controllers-links-module-StarModule-4550cb278a4c6a0834b1ff887937bd7c9faefaf814fb631e61c483b23c8b142c8f4b1c25f56fb672e970702a640cc964d93a67f5e25940bfb493859ddd2d2e47"' }>
                                            <li class="link">
                                                <a href="controllers/RepoStarController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoStarController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StarModule-4550cb278a4c6a0834b1ff887937bd7c9faefaf814fb631e61c483b23c8b142c8f4b1c25f56fb672e970702a640cc964d93a67f5e25940bfb493859ddd2d2e47"' : 'data-target="#xs-injectables-links-module-StarModule-4550cb278a4c6a0834b1ff887937bd7c9faefaf814fb631e61c483b23c8b142c8f4b1c25f56fb672e970702a640cc964d93a67f5e25940bfb493859ddd2d2e47"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StarModule-4550cb278a4c6a0834b1ff887937bd7c9faefaf814fb631e61c483b23c8b142c8f4b1c25f56fb672e970702a640cc964d93a67f5e25940bfb493859ddd2d2e47"' :
                                        'id="xs-injectables-links-module-StarModule-4550cb278a4c6a0834b1ff887937bd7c9faefaf814fb631e61c483b23c8b142c8f4b1c25f56fb672e970702a640cc964d93a67f5e25940bfb493859ddd2d2e47"' }>
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
                                            'data-target="#controllers-links-module-SubmitModule-c9f063d0ec271447bb08fa1f1d0abbb3b2f71afec9d3e9b5ec879c6a0805a5645af79c3a4ac7c6136fb2da25e2a4c2b7267b6c919a6862b95ecdb4385eb96f92"' : 'data-target="#xs-controllers-links-module-SubmitModule-c9f063d0ec271447bb08fa1f1d0abbb3b2f71afec9d3e9b5ec879c6a0805a5645af79c3a4ac7c6136fb2da25e2a4c2b7267b6c919a6862b95ecdb4385eb96f92"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SubmitModule-c9f063d0ec271447bb08fa1f1d0abbb3b2f71afec9d3e9b5ec879c6a0805a5645af79c3a4ac7c6136fb2da25e2a4c2b7267b6c919a6862b95ecdb4385eb96f92"' :
                                            'id="xs-controllers-links-module-SubmitModule-c9f063d0ec271447bb08fa1f1d0abbb3b2f71afec9d3e9b5ec879c6a0805a5645af79c3a4ac7c6136fb2da25e2a4c2b7267b6c919a6862b95ecdb4385eb96f92"' }>
                                            <li class="link">
                                                <a href="controllers/RepoSubmitController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoSubmitController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SubmitModule-c9f063d0ec271447bb08fa1f1d0abbb3b2f71afec9d3e9b5ec879c6a0805a5645af79c3a4ac7c6136fb2da25e2a4c2b7267b6c919a6862b95ecdb4385eb96f92"' : 'data-target="#xs-injectables-links-module-SubmitModule-c9f063d0ec271447bb08fa1f1d0abbb3b2f71afec9d3e9b5ec879c6a0805a5645af79c3a4ac7c6136fb2da25e2a4c2b7267b6c919a6862b95ecdb4385eb96f92"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SubmitModule-c9f063d0ec271447bb08fa1f1d0abbb3b2f71afec9d3e9b5ec879c6a0805a5645af79c3a4ac7c6136fb2da25e2a4c2b7267b6c919a6862b95ecdb4385eb96f92"' :
                                        'id="xs-injectables-links-module-SubmitModule-c9f063d0ec271447bb08fa1f1d0abbb3b2f71afec9d3e9b5ec879c6a0805a5645af79c3a4ac7c6136fb2da25e2a4c2b7267b6c919a6862b95ecdb4385eb96f92"' }>
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
                                            'data-target="#controllers-links-module-UserModule-302fbb8b7a43ecc90d8f223534de1e5bc36a59f0dfcdf6f1f66a3269c0dc7882bfc3de3eec43338fa025df305dc04ef6db3b7db08b21bf54adc19e996aa654d6"' : 'data-target="#xs-controllers-links-module-UserModule-302fbb8b7a43ecc90d8f223534de1e5bc36a59f0dfcdf6f1f66a3269c0dc7882bfc3de3eec43338fa025df305dc04ef6db3b7db08b21bf54adc19e996aa654d6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-302fbb8b7a43ecc90d8f223534de1e5bc36a59f0dfcdf6f1f66a3269c0dc7882bfc3de3eec43338fa025df305dc04ef6db3b7db08b21bf54adc19e996aa654d6"' :
                                            'id="xs-controllers-links-module-UserModule-302fbb8b7a43ecc90d8f223534de1e5bc36a59f0dfcdf6f1f66a3269c0dc7882bfc3de3eec43338fa025df305dc04ef6db3b7db08b21bf54adc19e996aa654d6"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserHighlightsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserHighlightsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-302fbb8b7a43ecc90d8f223534de1e5bc36a59f0dfcdf6f1f66a3269c0dc7882bfc3de3eec43338fa025df305dc04ef6db3b7db08b21bf54adc19e996aa654d6"' : 'data-target="#xs-injectables-links-module-UserModule-302fbb8b7a43ecc90d8f223534de1e5bc36a59f0dfcdf6f1f66a3269c0dc7882bfc3de3eec43338fa025df305dc04ef6db3b7db08b21bf54adc19e996aa654d6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-302fbb8b7a43ecc90d8f223534de1e5bc36a59f0dfcdf6f1f66a3269c0dc7882bfc3de3eec43338fa025df305dc04ef6db3b7db08b21bf54adc19e996aa654d6"' :
                                        'id="xs-injectables-links-module-UserModule-302fbb8b7a43ecc90d8f223534de1e5bc36a59f0dfcdf6f1f66a3269c0dc7882bfc3de3eec43338fa025df305dc04ef6db3b7db08b21bf54adc19e996aa654d6"' }>
                                        <li class="link">
                                            <a href="injectables/UserHighlightsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserHighlightsService</a>
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
                                            'data-target="#controllers-links-module-VoteModule-3f7021e2c9e58f903cb2181f8ce98c21276721a5735e666dd3e6915d0d25b0b7ff589bfd0f8b85bdb67685dc696f742db99f07773ca9d7ecc9554dbc8bb98381"' : 'data-target="#xs-controllers-links-module-VoteModule-3f7021e2c9e58f903cb2181f8ce98c21276721a5735e666dd3e6915d0d25b0b7ff589bfd0f8b85bdb67685dc696f742db99f07773ca9d7ecc9554dbc8bb98381"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-VoteModule-3f7021e2c9e58f903cb2181f8ce98c21276721a5735e666dd3e6915d0d25b0b7ff589bfd0f8b85bdb67685dc696f742db99f07773ca9d7ecc9554dbc8bb98381"' :
                                            'id="xs-controllers-links-module-VoteModule-3f7021e2c9e58f903cb2181f8ce98c21276721a5735e666dd3e6915d0d25b0b7ff589bfd0f8b85bdb67685dc696f742db99f07773ca9d7ecc9554dbc8bb98381"' }>
                                            <li class="link">
                                                <a href="controllers/RepoVoteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoVoteController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-VoteModule-3f7021e2c9e58f903cb2181f8ce98c21276721a5735e666dd3e6915d0d25b0b7ff589bfd0f8b85bdb67685dc696f742db99f07773ca9d7ecc9554dbc8bb98381"' : 'data-target="#xs-injectables-links-module-VoteModule-3f7021e2c9e58f903cb2181f8ce98c21276721a5735e666dd3e6915d0d25b0b7ff589bfd0f8b85bdb67685dc696f742db99f07773ca9d7ecc9554dbc8bb98381"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VoteModule-3f7021e2c9e58f903cb2181f8ce98c21276721a5735e666dd3e6915d0d25b0b7ff589bfd0f8b85bdb67685dc696f742db99f07773ca9d7ecc9554dbc8bb98381"' :
                                        'id="xs-injectables-links-module-VoteModule-3f7021e2c9e58f903cb2181f8ce98c21276721a5735e666dd3e6915d0d25b0b7ff589bfd0f8b85bdb67685dc696f742db99f07773ca9d7ecc9554dbc8bb98381"' }>
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
                                    <a href="entities/DbLog.html" data-type="entity-link" >DbLog</a>
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
                                    <a href="entities/DbUserHighlight.html" data-type="entity-link" >DbUserHighlight</a>
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
                                <a href="classes/CreateLogDto.html" data-type="entity-link" >CreateLogDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserHighlightDto.html" data-type="entity-link" >CreateUserHighlightDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseLoggerMiddleware.html" data-type="entity-link" >DatabaseLoggerMiddleware</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbUserHighlightRepo.html" data-type="entity-link" >DbUserHighlightRepo</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterOptionsDto.html" data-type="entity-link" >FilterOptionsDto</a>
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
                                <a href="classes/PullRequestPageOptionsDto.html" data-type="entity-link" >PullRequestPageOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepoInfo.html" data-type="entity-link" >RepoInfo</a>
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