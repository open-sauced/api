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
                    <a href="index.html" data-type="index-link">@open-sauced/api documentation</a>
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
                                <a href="modules/ApiServicesModule.html" data-type="entity-link" >ApiServicesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ApiServicesModule-c00dfc515e67acb8d99a17dc994c7ee2059b36740f9a2334a54837495ff04c56810420c7533e68127eb167ec6ed2a3eab2c5b2981a538f827618da1b9de9a934"' : 'data-target="#xs-injectables-links-module-ApiServicesModule-c00dfc515e67acb8d99a17dc994c7ee2059b36740f9a2334a54837495ff04c56810420c7533e68127eb167ec6ed2a3eab2c5b2981a538f827618da1b9de9a934"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ApiServicesModule-c00dfc515e67acb8d99a17dc994c7ee2059b36740f9a2334a54837495ff04c56810420c7533e68127eb167ec6ed2a3eab2c5b2981a538f827618da1b9de9a934"' :
                                        'id="xs-injectables-links-module-ApiServicesModule-c00dfc515e67acb8d99a17dc994c7ee2059b36740f9a2334a54837495ff04c56810420c7533e68127eb167ec6ed2a3eab2c5b2981a538f827618da1b9de9a934"' }>
                                        <li class="link">
                                            <a href="injectables/PagerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PagerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-5edcf1b4ee3560dc0faf69e330b73bdd801084f11de064535e39867b748c8cc6bc45f20c8f9f21cc4499a624abfc79e71f7a3f3134ea80fd094778120177de6a"' : 'data-target="#xs-controllers-links-module-AuthModule-5edcf1b4ee3560dc0faf69e330b73bdd801084f11de064535e39867b748c8cc6bc45f20c8f9f21cc4499a624abfc79e71f7a3f3134ea80fd094778120177de6a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-5edcf1b4ee3560dc0faf69e330b73bdd801084f11de064535e39867b748c8cc6bc45f20c8f9f21cc4499a624abfc79e71f7a3f3134ea80fd094778120177de6a"' :
                                            'id="xs-controllers-links-module-AuthModule-5edcf1b4ee3560dc0faf69e330b73bdd801084f11de064535e39867b748c8cc6bc45f20c8f9f21cc4499a624abfc79e71f7a3f3134ea80fd094778120177de6a"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-5edcf1b4ee3560dc0faf69e330b73bdd801084f11de064535e39867b748c8cc6bc45f20c8f9f21cc4499a624abfc79e71f7a3f3134ea80fd094778120177de6a"' : 'data-target="#xs-injectables-links-module-AuthModule-5edcf1b4ee3560dc0faf69e330b73bdd801084f11de064535e39867b748c8cc6bc45f20c8f9f21cc4499a624abfc79e71f7a3f3134ea80fd094778120177de6a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-5edcf1b4ee3560dc0faf69e330b73bdd801084f11de064535e39867b748c8cc6bc45f20c8f9f21cc4499a624abfc79e71f7a3f3134ea80fd094778120177de6a"' :
                                        'id="xs-injectables-links-module-AuthModule-5edcf1b4ee3560dc0faf69e330b73bdd801084f11de064535e39867b748c8cc6bc45f20c8f9f21cc4499a624abfc79e71f7a3f3134ea80fd094778120177de6a"' }>
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
                                <a href="modules/BlogSummaryModule.html" data-type="entity-link" >BlogSummaryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-BlogSummaryModule-3f2402cc217268ecad17711adbdbeb120cad21d7ef45ab2c593c7c0b2e2302db068bc5cc42fea7050bbcf74e7658ba2f86923ae9d80b1366c21fc65657403851"' : 'data-target="#xs-controllers-links-module-BlogSummaryModule-3f2402cc217268ecad17711adbdbeb120cad21d7ef45ab2c593c7c0b2e2302db068bc5cc42fea7050bbcf74e7658ba2f86923ae9d80b1366c21fc65657403851"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BlogSummaryModule-3f2402cc217268ecad17711adbdbeb120cad21d7ef45ab2c593c7c0b2e2302db068bc5cc42fea7050bbcf74e7658ba2f86923ae9d80b1366c21fc65657403851"' :
                                            'id="xs-controllers-links-module-BlogSummaryModule-3f2402cc217268ecad17711adbdbeb120cad21d7ef45ab2c593c7c0b2e2302db068bc5cc42fea7050bbcf74e7658ba2f86923ae9d80b1366c21fc65657403851"' }>
                                            <li class="link">
                                                <a href="controllers/BlogSummaryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BlogSummaryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-BlogSummaryModule-3f2402cc217268ecad17711adbdbeb120cad21d7ef45ab2c593c7c0b2e2302db068bc5cc42fea7050bbcf74e7658ba2f86923ae9d80b1366c21fc65657403851"' : 'data-target="#xs-injectables-links-module-BlogSummaryModule-3f2402cc217268ecad17711adbdbeb120cad21d7ef45ab2c593c7c0b2e2302db068bc5cc42fea7050bbcf74e7658ba2f86923ae9d80b1366c21fc65657403851"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BlogSummaryModule-3f2402cc217268ecad17711adbdbeb120cad21d7ef45ab2c593c7c0b2e2302db068bc5cc42fea7050bbcf74e7658ba2f86923ae9d80b1366c21fc65657403851"' :
                                        'id="xs-injectables-links-module-BlogSummaryModule-3f2402cc217268ecad17711adbdbeb120cad21d7ef45ab2c593c7c0b2e2302db068bc5cc42fea7050bbcf74e7658ba2f86923ae9d80b1366c21fc65657403851"' }>
                                        <li class="link">
                                            <a href="injectables/BlogSummaryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BlogSummaryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ContributorModule.html" data-type="entity-link" >ContributorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ContributorModule-39cf245cd627f3bebb55051cee3efd3781e55e2e60aad699501afb8d1bb62dcd075156268772200f4a13cc4626b5306faeae707c5df369dff7f46bd1a286a1e2"' : 'data-target="#xs-controllers-links-module-ContributorModule-39cf245cd627f3bebb55051cee3efd3781e55e2e60aad699501afb8d1bb62dcd075156268772200f4a13cc4626b5306faeae707c5df369dff7f46bd1a286a1e2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ContributorModule-39cf245cd627f3bebb55051cee3efd3781e55e2e60aad699501afb8d1bb62dcd075156268772200f4a13cc4626b5306faeae707c5df369dff7f46bd1a286a1e2"' :
                                            'id="xs-controllers-links-module-ContributorModule-39cf245cd627f3bebb55051cee3efd3781e55e2e60aad699501afb8d1bb62dcd075156268772200f4a13cc4626b5306faeae707c5df369dff7f46bd1a286a1e2"' }>
                                            <li class="link">
                                                <a href="controllers/ContributorController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContributorController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ContributorInsightsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContributorInsightsController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CouponModule.html" data-type="entity-link" >CouponModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CouponModule-4bacae1b830ba08a10c64a9709f0b815d50c35d2048d2d0c84eae76a916e066c8f43e3f11e7b0eb4a1f94ca0e3fd4cfdca6cc48fc4392480a50222a5990712e8"' : 'data-target="#xs-injectables-links-module-CouponModule-4bacae1b830ba08a10c64a9709f0b815d50c35d2048d2d0c84eae76a916e066c8f43e3f11e7b0eb4a1f94ca0e3fd4cfdca6cc48fc4392480a50222a5990712e8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CouponModule-4bacae1b830ba08a10c64a9709f0b815d50c35d2048d2d0c84eae76a916e066c8f43e3f11e7b0eb4a1f94ca0e3fd4cfdca6cc48fc4392480a50222a5990712e8"' :
                                        'id="xs-injectables-links-module-CouponModule-4bacae1b830ba08a10c64a9709f0b815d50c35d2048d2d0c84eae76a916e066c8f43e3f11e7b0eb4a1f94ca0e3fd4cfdca6cc48fc4392480a50222a5990712e8"' }>
                                        <li class="link">
                                            <a href="injectables/CouponService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CouponService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CustomerModule.html" data-type="entity-link" >CustomerModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CustomerModule-34fc60a04230fedc5f0fe0a09ab37b919e48dc3ca6f40dd2795a9f95e04ee6aec69c3e6b44596c1dafa4291f49e9f6403670bb553042a6c95f0c9b8a0ab27026"' : 'data-target="#xs-injectables-links-module-CustomerModule-34fc60a04230fedc5f0fe0a09ab37b919e48dc3ca6f40dd2795a9f95e04ee6aec69c3e6b44596c1dafa4291f49e9f6403670bb553042a6c95f0c9b8a0ab27026"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CustomerModule-34fc60a04230fedc5f0fe0a09ab37b919e48dc3ca6f40dd2795a9f95e04ee6aec69c3e6b44596c1dafa4291f49e9f6403670bb553042a6c95f0c9b8a0ab27026"' :
                                        'id="xs-injectables-links-module-CustomerModule-34fc60a04230fedc5f0fe0a09ab37b919e48dc3ca6f40dd2795a9f95e04ee6aec69c3e6b44596c1dafa4291f49e9f6403670bb553042a6c95f0c9b8a0ab27026"' }>
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
                                            'data-target="#controllers-links-module-EmojiModule-96f3536b06a81020da197807fe408c35aabe7078f33bf30dce665e5f32365b8ea7cf2da84546549d299ac8c55bccf3c66bf93aa5ba9b2fc2db4b0e44ffdf318f"' : 'data-target="#xs-controllers-links-module-EmojiModule-96f3536b06a81020da197807fe408c35aabe7078f33bf30dce665e5f32365b8ea7cf2da84546549d299ac8c55bccf3c66bf93aa5ba9b2fc2db4b0e44ffdf318f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EmojiModule-96f3536b06a81020da197807fe408c35aabe7078f33bf30dce665e5f32365b8ea7cf2da84546549d299ac8c55bccf3c66bf93aa5ba9b2fc2db4b0e44ffdf318f"' :
                                            'id="xs-controllers-links-module-EmojiModule-96f3536b06a81020da197807fe408c35aabe7078f33bf30dce665e5f32365b8ea7cf2da84546549d299ac8c55bccf3c66bf93aa5ba9b2fc2db4b0e44ffdf318f"' }>
                                            <li class="link">
                                                <a href="controllers/EmojiController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmojiController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EmojiModule-96f3536b06a81020da197807fe408c35aabe7078f33bf30dce665e5f32365b8ea7cf2da84546549d299ac8c55bccf3c66bf93aa5ba9b2fc2db4b0e44ffdf318f"' : 'data-target="#xs-injectables-links-module-EmojiModule-96f3536b06a81020da197807fe408c35aabe7078f33bf30dce665e5f32365b8ea7cf2da84546549d299ac8c55bccf3c66bf93aa5ba9b2fc2db4b0e44ffdf318f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EmojiModule-96f3536b06a81020da197807fe408c35aabe7078f33bf30dce665e5f32365b8ea7cf2da84546549d299ac8c55bccf3c66bf93aa5ba9b2fc2db4b0e44ffdf318f"' :
                                        'id="xs-injectables-links-module-EmojiModule-96f3536b06a81020da197807fe408c35aabe7078f33bf30dce665e5f32365b8ea7cf2da84546549d299ac8c55bccf3c66bf93aa5ba9b2fc2db4b0e44ffdf318f"' }>
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
                                            'data-target="#controllers-links-module-EndorsementModule-666fe0a0efa5fbf1f8dccd78e9cdba3512c484e800dafa017d82fc24288aaf2eaa754fcb31fe5e0375a692b5e0c366cfccc66f804a11070bb1725dff1b5f4429"' : 'data-target="#xs-controllers-links-module-EndorsementModule-666fe0a0efa5fbf1f8dccd78e9cdba3512c484e800dafa017d82fc24288aaf2eaa754fcb31fe5e0375a692b5e0c366cfccc66f804a11070bb1725dff1b5f4429"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EndorsementModule-666fe0a0efa5fbf1f8dccd78e9cdba3512c484e800dafa017d82fc24288aaf2eaa754fcb31fe5e0375a692b5e0c366cfccc66f804a11070bb1725dff1b5f4429"' :
                                            'id="xs-controllers-links-module-EndorsementModule-666fe0a0efa5fbf1f8dccd78e9cdba3512c484e800dafa017d82fc24288aaf2eaa754fcb31fe5e0375a692b5e0c366cfccc66f804a11070bb1725dff1b5f4429"' }>
                                            <li class="link">
                                                <a href="controllers/EndorsementController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EndorsementController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EndorsementModule-666fe0a0efa5fbf1f8dccd78e9cdba3512c484e800dafa017d82fc24288aaf2eaa754fcb31fe5e0375a692b5e0c366cfccc66f804a11070bb1725dff1b5f4429"' : 'data-target="#xs-injectables-links-module-EndorsementModule-666fe0a0efa5fbf1f8dccd78e9cdba3512c484e800dafa017d82fc24288aaf2eaa754fcb31fe5e0375a692b5e0c366cfccc66f804a11070bb1725dff1b5f4429"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EndorsementModule-666fe0a0efa5fbf1f8dccd78e9cdba3512c484e800dafa017d82fc24288aaf2eaa754fcb31fe5e0375a692b5e0c366cfccc66f804a11070bb1725dff1b5f4429"' :
                                        'id="xs-injectables-links-module-EndorsementModule-666fe0a0efa5fbf1f8dccd78e9cdba3512c484e800dafa017d82fc24288aaf2eaa754fcb31fe5e0375a692b5e0c366cfccc66f804a11070bb1725dff1b5f4429"' }>
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
                                            'data-target="#controllers-links-module-HighlightModule-6e516543943c88fbbc2e5ec080cca83e37a9aa7bc93cd5a317b2ccc7c9b94648e808a2a261c16e1e95b270c7de18dbc5284be982377cb64015cf76874206a2ff"' : 'data-target="#xs-controllers-links-module-HighlightModule-6e516543943c88fbbc2e5ec080cca83e37a9aa7bc93cd5a317b2ccc7c9b94648e808a2a261c16e1e95b270c7de18dbc5284be982377cb64015cf76874206a2ff"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HighlightModule-6e516543943c88fbbc2e5ec080cca83e37a9aa7bc93cd5a317b2ccc7c9b94648e808a2a261c16e1e95b270c7de18dbc5284be982377cb64015cf76874206a2ff"' :
                                            'id="xs-controllers-links-module-HighlightModule-6e516543943c88fbbc2e5ec080cca83e37a9aa7bc93cd5a317b2ccc7c9b94648e808a2a261c16e1e95b270c7de18dbc5284be982377cb64015cf76874206a2ff"' }>
                                            <li class="link">
                                                <a href="controllers/HighlightController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HighlightController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HistogramModule.html" data-type="entity-link" >HistogramModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-HistogramModule-5885cd8d5e3fa3890e9b3fbba7a5aa5d16a0ca5d3944216d7609b83ce5c1f61ddcb032c234cfae09122c1aedcf6e1434c9e3cb5379440f57b4f50a537eda4a76"' : 'data-target="#xs-controllers-links-module-HistogramModule-5885cd8d5e3fa3890e9b3fbba7a5aa5d16a0ca5d3944216d7609b83ce5c1f61ddcb032c234cfae09122c1aedcf6e1434c9e3cb5379440f57b4f50a537eda4a76"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HistogramModule-5885cd8d5e3fa3890e9b3fbba7a5aa5d16a0ca5d3944216d7609b83ce5c1f61ddcb032c234cfae09122c1aedcf6e1434c9e3cb5379440f57b4f50a537eda4a76"' :
                                            'id="xs-controllers-links-module-HistogramModule-5885cd8d5e3fa3890e9b3fbba7a5aa5d16a0ca5d3944216d7609b83ce5c1f61ddcb032c234cfae09122c1aedcf6e1434c9e3cb5379440f57b4f50a537eda4a76"' }>
                                            <li class="link">
                                                <a href="controllers/HistogramController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HistogramController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InsightsModule.html" data-type="entity-link" >InsightsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-InsightsModule-aa79502af984e5d4b0a84d8496575b7cfc877c65dd653b005ae36f218e480c1a3e027684eb7a600c5e9e2ca5c51b4244f2540fbc50b3ed39838e14e54f3aad6c"' : 'data-target="#xs-controllers-links-module-InsightsModule-aa79502af984e5d4b0a84d8496575b7cfc877c65dd653b005ae36f218e480c1a3e027684eb7a600c5e9e2ca5c51b4244f2540fbc50b3ed39838e14e54f3aad6c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-InsightsModule-aa79502af984e5d4b0a84d8496575b7cfc877c65dd653b005ae36f218e480c1a3e027684eb7a600c5e9e2ca5c51b4244f2540fbc50b3ed39838e14e54f3aad6c"' :
                                            'id="xs-controllers-links-module-InsightsModule-aa79502af984e5d4b0a84d8496575b7cfc877c65dd653b005ae36f218e480c1a3e027684eb7a600c5e9e2ca5c51b4244f2540fbc50b3ed39838e14e54f3aad6c"' }>
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
                                        'data-target="#injectables-links-module-InsightsModule-aa79502af984e5d4b0a84d8496575b7cfc877c65dd653b005ae36f218e480c1a3e027684eb7a600c5e9e2ca5c51b4244f2540fbc50b3ed39838e14e54f3aad6c"' : 'data-target="#xs-injectables-links-module-InsightsModule-aa79502af984e5d4b0a84d8496575b7cfc877c65dd653b005ae36f218e480c1a3e027684eb7a600c5e9e2ca5c51b4244f2540fbc50b3ed39838e14e54f3aad6c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InsightsModule-aa79502af984e5d4b0a84d8496575b7cfc877c65dd653b005ae36f218e480c1a3e027684eb7a600c5e9e2ca5c51b4244f2540fbc50b3ed39838e14e54f3aad6c"' :
                                        'id="xs-injectables-links-module-InsightsModule-aa79502af984e5d4b0a84d8496575b7cfc877c65dd653b005ae36f218e480c1a3e027684eb7a600c5e9e2ca5c51b4244f2540fbc50b3ed39838e14e54f3aad6c"' }>
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
                                <a href="modules/IssueSummaryModule.html" data-type="entity-link" >IssueSummaryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-IssueSummaryModule-153b35589d181799ffab58d3f730f946c72e87d4956b7abe8e40b5b7fec0426d9f6f0d5bf86aec8b677a691f3aab448ba6d7e215351fe5b6cf6cd3d30595744c"' : 'data-target="#xs-controllers-links-module-IssueSummaryModule-153b35589d181799ffab58d3f730f946c72e87d4956b7abe8e40b5b7fec0426d9f6f0d5bf86aec8b677a691f3aab448ba6d7e215351fe5b6cf6cd3d30595744c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-IssueSummaryModule-153b35589d181799ffab58d3f730f946c72e87d4956b7abe8e40b5b7fec0426d9f6f0d5bf86aec8b677a691f3aab448ba6d7e215351fe5b6cf6cd3d30595744c"' :
                                            'id="xs-controllers-links-module-IssueSummaryModule-153b35589d181799ffab58d3f730f946c72e87d4956b7abe8e40b5b7fec0426d9f6f0d5bf86aec8b677a691f3aab448ba6d7e215351fe5b6cf6cd3d30595744c"' }>
                                            <li class="link">
                                                <a href="controllers/IssueSummaryController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueSummaryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-IssueSummaryModule-153b35589d181799ffab58d3f730f946c72e87d4956b7abe8e40b5b7fec0426d9f6f0d5bf86aec8b677a691f3aab448ba6d7e215351fe5b6cf6cd3d30595744c"' : 'data-target="#xs-injectables-links-module-IssueSummaryModule-153b35589d181799ffab58d3f730f946c72e87d4956b7abe8e40b5b7fec0426d9f6f0d5bf86aec8b677a691f3aab448ba6d7e215351fe5b6cf6cd3d30595744c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-IssueSummaryModule-153b35589d181799ffab58d3f730f946c72e87d4956b7abe8e40b5b7fec0426d9f6f0d5bf86aec8b677a691f3aab448ba6d7e215351fe5b6cf6cd3d30595744c"' :
                                        'id="xs-injectables-links-module-IssueSummaryModule-153b35589d181799ffab58d3f730f946c72e87d4956b7abe8e40b5b7fec0426d9f6f0d5bf86aec8b677a691f3aab448ba6d7e215351fe5b6cf6cd3d30595744c"' }>
                                        <li class="link">
                                            <a href="injectables/IssueSummaryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueSummaryService</a>
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
                                <a href="modules/OpenAiModule.html" data-type="entity-link" >OpenAiModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-OpenAiModule-a2a9010e78263e2cd5e3d5f3ca1e7630561b3705dd03ecde2f148b57701033807c5c1729336783041e277857b28587e58f490d6712696fdc5ec5e1e31ab5ca54"' : 'data-target="#xs-injectables-links-module-OpenAiModule-a2a9010e78263e2cd5e3d5f3ca1e7630561b3705dd03ecde2f148b57701033807c5c1729336783041e277857b28587e58f490d6712696fdc5ec5e1e31ab5ca54"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OpenAiModule-a2a9010e78263e2cd5e3d5f3ca1e7630561b3705dd03ecde2f148b57701033807c5c1729336783041e277857b28587e58f490d6712696fdc5ec5e1e31ab5ca54"' :
                                        'id="xs-injectables-links-module-OpenAiModule-a2a9010e78263e2cd5e3d5f3ca1e7630561b3705dd03ecde2f148b57701033807c5c1729336783041e277857b28587e58f490d6712696fdc5ec5e1e31ab5ca54"' }>
                                        <li class="link">
                                            <a href="injectables/OpenAiService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OpenAiService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PizzaOvenModule.html" data-type="entity-link" >PizzaOvenModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PizzaOvenModule-bc86828e6dd2c004eebf8b74bb5ea778c125f07ca67027e3d576ecc10be5544cf8458e55d43eefde3526c72e85edebec107b86c9edddc33a2285abb17bb2780c"' : 'data-target="#xs-controllers-links-module-PizzaOvenModule-bc86828e6dd2c004eebf8b74bb5ea778c125f07ca67027e3d576ecc10be5544cf8458e55d43eefde3526c72e85edebec107b86c9edddc33a2285abb17bb2780c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PizzaOvenModule-bc86828e6dd2c004eebf8b74bb5ea778c125f07ca67027e3d576ecc10be5544cf8458e55d43eefde3526c72e85edebec107b86c9edddc33a2285abb17bb2780c"' :
                                            'id="xs-controllers-links-module-PizzaOvenModule-bc86828e6dd2c004eebf8b74bb5ea778c125f07ca67027e3d576ecc10be5544cf8458e55d43eefde3526c72e85edebec107b86c9edddc33a2285abb17bb2780c"' }>
                                            <li class="link">
                                                <a href="controllers/PizzaOvenController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PizzaOvenController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PizzaOvenModule-bc86828e6dd2c004eebf8b74bb5ea778c125f07ca67027e3d576ecc10be5544cf8458e55d43eefde3526c72e85edebec107b86c9edddc33a2285abb17bb2780c"' : 'data-target="#xs-injectables-links-module-PizzaOvenModule-bc86828e6dd2c004eebf8b74bb5ea778c125f07ca67027e3d576ecc10be5544cf8458e55d43eefde3526c72e85edebec107b86c9edddc33a2285abb17bb2780c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PizzaOvenModule-bc86828e6dd2c004eebf8b74bb5ea778c125f07ca67027e3d576ecc10be5544cf8458e55d43eefde3526c72e85edebec107b86c9edddc33a2285abb17bb2780c"' :
                                        'id="xs-injectables-links-module-PizzaOvenModule-bc86828e6dd2c004eebf8b74bb5ea778c125f07ca67027e3d576ecc10be5544cf8458e55d43eefde3526c72e85edebec107b86c9edddc33a2285abb17bb2780c"' }>
                                        <li class="link">
                                            <a href="injectables/CommitAuthorsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommitAuthorsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CommitsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommitsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PizzaOvenService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PizzaOvenService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PullRequestModule.html" data-type="entity-link" >PullRequestModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PullRequestModule-18ef298e56459c53a19a0c2b6c57a6a36866d14f46be8211a6e6819229296dc4a5fafdc883542e92ff7fdbd94a9df5510c20e39acc35cfb1ad3f24dec25797a6"' : 'data-target="#xs-controllers-links-module-PullRequestModule-18ef298e56459c53a19a0c2b6c57a6a36866d14f46be8211a6e6819229296dc4a5fafdc883542e92ff7fdbd94a9df5510c20e39acc35cfb1ad3f24dec25797a6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PullRequestModule-18ef298e56459c53a19a0c2b6c57a6a36866d14f46be8211a6e6819229296dc4a5fafdc883542e92ff7fdbd94a9df5510c20e39acc35cfb1ad3f24dec25797a6"' :
                                            'id="xs-controllers-links-module-PullRequestModule-18ef298e56459c53a19a0c2b6c57a6a36866d14f46be8211a6e6819229296dc4a5fafdc883542e92ff7fdbd94a9df5510c20e39acc35cfb1ad3f24dec25797a6"' }>
                                            <li class="link">
                                                <a href="controllers/CodeExplanationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodeExplanationController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/CodeRefactorSuggestionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodeRefactorSuggestionController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/CodeTestSuggestionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodeTestSuggestionController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PullRequestController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PullRequestDescriptionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestDescriptionController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PullRequestReviewsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestReviewsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PullRequestModule-18ef298e56459c53a19a0c2b6c57a6a36866d14f46be8211a6e6819229296dc4a5fafdc883542e92ff7fdbd94a9df5510c20e39acc35cfb1ad3f24dec25797a6"' : 'data-target="#xs-injectables-links-module-PullRequestModule-18ef298e56459c53a19a0c2b6c57a6a36866d14f46be8211a6e6819229296dc4a5fafdc883542e92ff7fdbd94a9df5510c20e39acc35cfb1ad3f24dec25797a6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PullRequestModule-18ef298e56459c53a19a0c2b6c57a6a36866d14f46be8211a6e6819229296dc4a5fafdc883542e92ff7fdbd94a9df5510c20e39acc35cfb1ad3f24dec25797a6"' :
                                        'id="xs-injectables-links-module-PullRequestModule-18ef298e56459c53a19a0c2b6c57a6a36866d14f46be8211a6e6819229296dc4a5fafdc883542e92ff7fdbd94a9df5510c20e39acc35cfb1ad3f24dec25797a6"' }>
                                        <li class="link">
                                            <a href="injectables/CodeExplanationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodeExplanationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CodeRefactorSuggestionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodeRefactorSuggestionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CodeTestSuggestionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CodeTestSuggestionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PullRequestDescriptionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestDescriptionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PullRequestInsightsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestInsightsService</a>
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
                                            'data-target="#controllers-links-module-RepoModule-ad243c4edb1aa03fb3ba379238df67d8776eae1bdfa8d8c9b99ac63b6663074a97320514e0edcf001a719412cb6de1ab2f5b1b59143029663d30f4216b0da9c5"' : 'data-target="#xs-controllers-links-module-RepoModule-ad243c4edb1aa03fb3ba379238df67d8776eae1bdfa8d8c9b99ac63b6663074a97320514e0edcf001a719412cb6de1ab2f5b1b59143029663d30f4216b0da9c5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RepoModule-ad243c4edb1aa03fb3ba379238df67d8776eae1bdfa8d8c9b99ac63b6663074a97320514e0edcf001a719412cb6de1ab2f5b1b59143029663d30f4216b0da9c5"' :
                                            'id="xs-controllers-links-module-RepoModule-ad243c4edb1aa03fb3ba379238df67d8776eae1bdfa8d8c9b99ac63b6663074a97320514e0edcf001a719412cb6de1ab2f5b1b59143029663d30f4216b0da9c5"' }>
                                            <li class="link">
                                                <a href="controllers/RepoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RepoModule-ad243c4edb1aa03fb3ba379238df67d8776eae1bdfa8d8c9b99ac63b6663074a97320514e0edcf001a719412cb6de1ab2f5b1b59143029663d30f4216b0da9c5"' : 'data-target="#xs-injectables-links-module-RepoModule-ad243c4edb1aa03fb3ba379238df67d8776eae1bdfa8d8c9b99ac63b6663074a97320514e0edcf001a719412cb6de1ab2f5b1b59143029663d30f4216b0da9c5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RepoModule-ad243c4edb1aa03fb3ba379238df67d8776eae1bdfa8d8c9b99ac63b6663074a97320514e0edcf001a719412cb6de1ab2f5b1b59143029663d30f4216b0da9c5"' :
                                        'id="xs-injectables-links-module-RepoModule-ad243c4edb1aa03fb3ba379238df67d8776eae1bdfa8d8c9b99ac63b6663074a97320514e0edcf001a719412cb6de1ab2f5b1b59143029663d30f4216b0da9c5"' }>
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
                                            'data-target="#controllers-links-module-StargazeModule-efeecd562ffbc32491b8f9ebdf91049601d65cf2d67ec8a6e53abae232cceb2c9ba2548c1d35019a31ef7980df1e8abf524c4666974456f42f385564569c7169"' : 'data-target="#xs-controllers-links-module-StargazeModule-efeecd562ffbc32491b8f9ebdf91049601d65cf2d67ec8a6e53abae232cceb2c9ba2548c1d35019a31ef7980df1e8abf524c4666974456f42f385564569c7169"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StargazeModule-efeecd562ffbc32491b8f9ebdf91049601d65cf2d67ec8a6e53abae232cceb2c9ba2548c1d35019a31ef7980df1e8abf524c4666974456f42f385564569c7169"' :
                                            'id="xs-controllers-links-module-StargazeModule-efeecd562ffbc32491b8f9ebdf91049601d65cf2d67ec8a6e53abae232cceb2c9ba2548c1d35019a31ef7980df1e8abf524c4666974456f42f385564569c7169"' }>
                                            <li class="link">
                                                <a href="controllers/RepoStargazeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoStargazeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StargazeModule-efeecd562ffbc32491b8f9ebdf91049601d65cf2d67ec8a6e53abae232cceb2c9ba2548c1d35019a31ef7980df1e8abf524c4666974456f42f385564569c7169"' : 'data-target="#xs-injectables-links-module-StargazeModule-efeecd562ffbc32491b8f9ebdf91049601d65cf2d67ec8a6e53abae232cceb2c9ba2548c1d35019a31ef7980df1e8abf524c4666974456f42f385564569c7169"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StargazeModule-efeecd562ffbc32491b8f9ebdf91049601d65cf2d67ec8a6e53abae232cceb2c9ba2548c1d35019a31ef7980df1e8abf524c4666974456f42f385564569c7169"' :
                                        'id="xs-injectables-links-module-StargazeModule-efeecd562ffbc32491b8f9ebdf91049601d65cf2d67ec8a6e53abae232cceb2c9ba2548c1d35019a31ef7980df1e8abf524c4666974456f42f385564569c7169"' }>
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
                                            'data-target="#controllers-links-module-StarModule-14ff7277daeb8b7d508df23cf912bdf6fc81d5b3b52c2825dd4080b4744b0e7809e642943d8c3fd30e7765baded339db27e1e557f5539e30c03213feb72096c9"' : 'data-target="#xs-controllers-links-module-StarModule-14ff7277daeb8b7d508df23cf912bdf6fc81d5b3b52c2825dd4080b4744b0e7809e642943d8c3fd30e7765baded339db27e1e557f5539e30c03213feb72096c9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StarModule-14ff7277daeb8b7d508df23cf912bdf6fc81d5b3b52c2825dd4080b4744b0e7809e642943d8c3fd30e7765baded339db27e1e557f5539e30c03213feb72096c9"' :
                                            'id="xs-controllers-links-module-StarModule-14ff7277daeb8b7d508df23cf912bdf6fc81d5b3b52c2825dd4080b4744b0e7809e642943d8c3fd30e7765baded339db27e1e557f5539e30c03213feb72096c9"' }>
                                            <li class="link">
                                                <a href="controllers/RepoStarController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoStarController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StarModule-14ff7277daeb8b7d508df23cf912bdf6fc81d5b3b52c2825dd4080b4744b0e7809e642943d8c3fd30e7765baded339db27e1e557f5539e30c03213feb72096c9"' : 'data-target="#xs-injectables-links-module-StarModule-14ff7277daeb8b7d508df23cf912bdf6fc81d5b3b52c2825dd4080b4744b0e7809e642943d8c3fd30e7765baded339db27e1e557f5539e30c03213feb72096c9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StarModule-14ff7277daeb8b7d508df23cf912bdf6fc81d5b3b52c2825dd4080b4744b0e7809e642943d8c3fd30e7765baded339db27e1e557f5539e30c03213feb72096c9"' :
                                        'id="xs-injectables-links-module-StarModule-14ff7277daeb8b7d508df23cf912bdf6fc81d5b3b52c2825dd4080b4744b0e7809e642943d8c3fd30e7765baded339db27e1e557f5539e30c03213feb72096c9"' }>
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
                                        'data-target="#injectables-links-module-StripeSubscriptionModule-cfcaad2091c84661c4d1ff7fc8822ae28c38109a6d8494055c24b994b3242ce6064e2cdd7dfe6afbf468c83a590c964c6a8c7ee671017397e04920e1531db167"' : 'data-target="#xs-injectables-links-module-StripeSubscriptionModule-cfcaad2091c84661c4d1ff7fc8822ae28c38109a6d8494055c24b994b3242ce6064e2cdd7dfe6afbf468c83a590c964c6a8c7ee671017397e04920e1531db167"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StripeSubscriptionModule-cfcaad2091c84661c4d1ff7fc8822ae28c38109a6d8494055c24b994b3242ce6064e2cdd7dfe6afbf468c83a590c964c6a8c7ee671017397e04920e1531db167"' :
                                        'id="xs-injectables-links-module-StripeSubscriptionModule-cfcaad2091c84661c4d1ff7fc8822ae28c38109a6d8494055c24b994b3242ce6064e2cdd7dfe6afbf468c83a590c964c6a8c7ee671017397e04920e1531db167"' }>
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
                                            'data-target="#controllers-links-module-StripeWebHookModule-5bb159222cfbb158da5c25db2b9a1b1712a6ceb942e8d9725559b73bb5ceffbd8a1664bc45439a9677824ab3176ebab5635edcdaf4ecc5b1169d8decdd679bcd"' : 'data-target="#xs-controllers-links-module-StripeWebHookModule-5bb159222cfbb158da5c25db2b9a1b1712a6ceb942e8d9725559b73bb5ceffbd8a1664bc45439a9677824ab3176ebab5635edcdaf4ecc5b1169d8decdd679bcd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StripeWebHookModule-5bb159222cfbb158da5c25db2b9a1b1712a6ceb942e8d9725559b73bb5ceffbd8a1664bc45439a9677824ab3176ebab5635edcdaf4ecc5b1169d8decdd679bcd"' :
                                            'id="xs-controllers-links-module-StripeWebHookModule-5bb159222cfbb158da5c25db2b9a1b1712a6ceb942e8d9725559b73bb5ceffbd8a1664bc45439a9677824ab3176ebab5635edcdaf4ecc5b1169d8decdd679bcd"' }>
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
                                            'data-target="#controllers-links-module-SubmitModule-bebb2852a857d0e7da5a5864a561827f9a70e03041c742fafcf6224590863e43bfa87cf29a674e840e4ecbc29c925736bc21d3bc58c95aba2a5670b5d16dddd2"' : 'data-target="#xs-controllers-links-module-SubmitModule-bebb2852a857d0e7da5a5864a561827f9a70e03041c742fafcf6224590863e43bfa87cf29a674e840e4ecbc29c925736bc21d3bc58c95aba2a5670b5d16dddd2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SubmitModule-bebb2852a857d0e7da5a5864a561827f9a70e03041c742fafcf6224590863e43bfa87cf29a674e840e4ecbc29c925736bc21d3bc58c95aba2a5670b5d16dddd2"' :
                                            'id="xs-controllers-links-module-SubmitModule-bebb2852a857d0e7da5a5864a561827f9a70e03041c742fafcf6224590863e43bfa87cf29a674e840e4ecbc29c925736bc21d3bc58c95aba2a5670b5d16dddd2"' }>
                                            <li class="link">
                                                <a href="controllers/RepoSubmitController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoSubmitController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SubmitModule-bebb2852a857d0e7da5a5864a561827f9a70e03041c742fafcf6224590863e43bfa87cf29a674e840e4ecbc29c925736bc21d3bc58c95aba2a5670b5d16dddd2"' : 'data-target="#xs-injectables-links-module-SubmitModule-bebb2852a857d0e7da5a5864a561827f9a70e03041c742fafcf6224590863e43bfa87cf29a674e840e4ecbc29c925736bc21d3bc58c95aba2a5670b5d16dddd2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SubmitModule-bebb2852a857d0e7da5a5864a561827f9a70e03041c742fafcf6224590863e43bfa87cf29a674e840e4ecbc29c925736bc21d3bc58c95aba2a5670b5d16dddd2"' :
                                        'id="xs-injectables-links-module-SubmitModule-bebb2852a857d0e7da5a5864a561827f9a70e03041c742fafcf6224590863e43bfa87cf29a674e840e4ecbc29c925736bc21d3bc58c95aba2a5670b5d16dddd2"' }>
                                        <li class="link">
                                            <a href="injectables/SubmitService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SubmitService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TimescaleModule.html" data-type="entity-link" >TimescaleModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TimescaleModule-838bb9e5e2e1720fbbaa80c6f7fbb5638e71d9204080dcd1c5b274708793e8757af776719235dea3bbd6071a8f3691db9400b14e6ed4a818edaa0053536196c7"' : 'data-target="#xs-injectables-links-module-TimescaleModule-838bb9e5e2e1720fbbaa80c6f7fbb5638e71d9204080dcd1c5b274708793e8757af776719235dea3bbd6071a8f3691db9400b14e6ed4a818edaa0053536196c7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TimescaleModule-838bb9e5e2e1720fbbaa80c6f7fbb5638e71d9204080dcd1c5b274708793e8757af776719235dea3bbd6071a8f3691db9400b14e6ed4a818edaa0053536196c7"' :
                                        'id="xs-injectables-links-module-TimescaleModule-838bb9e5e2e1720fbbaa80c6f7fbb5638e71d9204080dcd1c5b274708793e8757af776719235dea3bbd6071a8f3691db9400b14e6ed4a818edaa0053536196c7"' }>
                                        <li class="link">
                                            <a href="injectables/ForkGithubEventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForkGithubEventsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/IssueCommentGithubEventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssueCommentGithubEventsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/IssuesGithubEventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IssuesGithubEventsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PullRequestGithubEventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestGithubEventsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PullRequestReviewGithubEventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PullRequestReviewGithubEventsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PushGithubEventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PushGithubEventsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RepoDevstatsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoDevstatsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WatchGithubEventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WatchGithubEventsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserListModule.html" data-type="entity-link" >UserListModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserListModule-c827fa43760992e60778408828ab51dbc3f9435ff8349f37ed100cc96e5e8961915766f3ff22850b1f1d89e7381b3cbcca6a0c50c5127042d65ed7e1e6e7e8ba"' : 'data-target="#xs-controllers-links-module-UserListModule-c827fa43760992e60778408828ab51dbc3f9435ff8349f37ed100cc96e5e8961915766f3ff22850b1f1d89e7381b3cbcca6a0c50c5127042d65ed7e1e6e7e8ba"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserListModule-c827fa43760992e60778408828ab51dbc3f9435ff8349f37ed100cc96e5e8961915766f3ff22850b1f1d89e7381b3cbcca6a0c50c5127042d65ed7e1e6e7e8ba"' :
                                            'id="xs-controllers-links-module-UserListModule-c827fa43760992e60778408828ab51dbc3f9435ff8349f37ed100cc96e5e8961915766f3ff22850b1f1d89e7381b3cbcca6a0c50c5127042d65ed7e1e6e7e8ba"' }>
                                            <li class="link">
                                                <a href="controllers/UserListController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserListController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserListStatsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserListStatsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserListModule-c827fa43760992e60778408828ab51dbc3f9435ff8349f37ed100cc96e5e8961915766f3ff22850b1f1d89e7381b3cbcca6a0c50c5127042d65ed7e1e6e7e8ba"' : 'data-target="#xs-injectables-links-module-UserListModule-c827fa43760992e60778408828ab51dbc3f9435ff8349f37ed100cc96e5e8961915766f3ff22850b1f1d89e7381b3cbcca6a0c50c5127042d65ed7e1e6e7e8ba"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserListModule-c827fa43760992e60778408828ab51dbc3f9435ff8349f37ed100cc96e5e8961915766f3ff22850b1f1d89e7381b3cbcca6a0c50c5127042d65ed7e1e6e7e8ba"' :
                                        'id="xs-injectables-links-module-UserListModule-c827fa43760992e60778408828ab51dbc3f9435ff8349f37ed100cc96e5e8961915766f3ff22850b1f1d89e7381b3cbcca6a0c50c5127042d65ed7e1e6e7e8ba"' }>
                                        <li class="link">
                                            <a href="injectables/UserListEventsStatsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserListEventsStatsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserListService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserListService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-9477bd0073283aaf61e8caf72084fe4b21ba19ebcfce024242cd15ffce71419f028c0c014aef7cd74af0940592c9be73a05feee18553259e7fd5cc5684d9d4c1"' : 'data-target="#xs-controllers-links-module-UserModule-9477bd0073283aaf61e8caf72084fe4b21ba19ebcfce024242cd15ffce71419f028c0c014aef7cd74af0940592c9be73a05feee18553259e7fd5cc5684d9d4c1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-9477bd0073283aaf61e8caf72084fe4b21ba19ebcfce024242cd15ffce71419f028c0c014aef7cd74af0940592c9be73a05feee18553259e7fd5cc5684d9d4c1"' :
                                            'id="xs-controllers-links-module-UserModule-9477bd0073283aaf61e8caf72084fe4b21ba19ebcfce024242cd15ffce71419f028c0c014aef7cd74af0940592c9be73a05feee18553259e7fd5cc5684d9d4c1"' }>
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
                                                <a href="controllers/UserFollowingController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserFollowingController</a>
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
                                            <li class="link">
                                                <a href="controllers/UserRecommendationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserRecommendationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-9477bd0073283aaf61e8caf72084fe4b21ba19ebcfce024242cd15ffce71419f028c0c014aef7cd74af0940592c9be73a05feee18553259e7fd5cc5684d9d4c1"' : 'data-target="#xs-injectables-links-module-UserModule-9477bd0073283aaf61e8caf72084fe4b21ba19ebcfce024242cd15ffce71419f028c0c014aef7cd74af0940592c9be73a05feee18553259e7fd5cc5684d9d4c1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-9477bd0073283aaf61e8caf72084fe4b21ba19ebcfce024242cd15ffce71419f028c0c014aef7cd74af0940592c9be73a05feee18553259e7fd5cc5684d9d4c1"' :
                                        'id="xs-injectables-links-module-UserModule-9477bd0073283aaf61e8caf72084fe4b21ba19ebcfce024242cd15ffce71419f028c0c014aef7cd74af0940592c9be73a05feee18553259e7fd5cc5684d9d4c1"' }>
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
                                            <a href="injectables/UserOrganizationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserOrganizationService</a>
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
                                        'data-target="#injectables-links-module-UserReposModule-c13938b973aeab7fa880821795089d013d1903b2067931cdd48a201f54b9ab438fe93489f4fe357bf8f2a597e5cd46c048989fd888a4a34892000c38afd46985"' : 'data-target="#xs-injectables-links-module-UserReposModule-c13938b973aeab7fa880821795089d013d1903b2067931cdd48a201f54b9ab438fe93489f4fe357bf8f2a597e5cd46c048989fd888a4a34892000c38afd46985"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserReposModule-c13938b973aeab7fa880821795089d013d1903b2067931cdd48a201f54b9ab438fe93489f4fe357bf8f2a597e5cd46c048989fd888a4a34892000c38afd46985"' :
                                        'id="xs-injectables-links-module-UserReposModule-c13938b973aeab7fa880821795089d013d1903b2067931cdd48a201f54b9ab438fe93489f4fe357bf8f2a597e5cd46c048989fd888a4a34892000c38afd46985"' }>
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
                                            'data-target="#controllers-links-module-VoteModule-a2596780da847218ea4c7c72bae76af446cd43fc6907d3841a440b2959c12c2d26a764411eeaf9d737930718fb521a8b8daaf2588073714f902d6a06c1691142"' : 'data-target="#xs-controllers-links-module-VoteModule-a2596780da847218ea4c7c72bae76af446cd43fc6907d3841a440b2959c12c2d26a764411eeaf9d737930718fb521a8b8daaf2588073714f902d6a06c1691142"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-VoteModule-a2596780da847218ea4c7c72bae76af446cd43fc6907d3841a440b2959c12c2d26a764411eeaf9d737930718fb521a8b8daaf2588073714f902d6a06c1691142"' :
                                            'id="xs-controllers-links-module-VoteModule-a2596780da847218ea4c7c72bae76af446cd43fc6907d3841a440b2959c12c2d26a764411eeaf9d737930718fb521a8b8daaf2588073714f902d6a06c1691142"' }>
                                            <li class="link">
                                                <a href="controllers/RepoVoteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoVoteController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-VoteModule-a2596780da847218ea4c7c72bae76af446cd43fc6907d3841a440b2959c12c2d26a764411eeaf9d737930718fb521a8b8daaf2588073714f902d6a06c1691142"' : 'data-target="#xs-injectables-links-module-VoteModule-a2596780da847218ea4c7c72bae76af446cd43fc6907d3841a440b2959c12c2d26a764411eeaf9d737930718fb521a8b8daaf2588073714f902d6a06c1691142"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VoteModule-a2596780da847218ea4c7c72bae76af446cd43fc6907d3841a440b2959c12c2d26a764411eeaf9d737930718fb521a8b8daaf2588073714f902d6a06c1691142"' :
                                        'id="xs-injectables-links-module-VoteModule-a2596780da847218ea4c7c72bae76af446cd43fc6907d3841a440b2959c12c2d26a764411eeaf9d737930718fb521a8b8daaf2588073714f902d6a06c1691142"' }>
                                        <li class="link">
                                            <a href="injectables/VoteService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VoteService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WorkspaceModule.html" data-type="entity-link" >WorkspaceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-WorkspaceModule-d5c2f92c7694724b4ad69aaa4cd2a091faf2ac1aad93ebcf2a2a209c479c21549efb56e9e884711868206b092f65386064f22a66ed0afb6c76c50e40ee6a30b7"' : 'data-target="#xs-controllers-links-module-WorkspaceModule-d5c2f92c7694724b4ad69aaa4cd2a091faf2ac1aad93ebcf2a2a209c479c21549efb56e9e884711868206b092f65386064f22a66ed0afb6c76c50e40ee6a30b7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-WorkspaceModule-d5c2f92c7694724b4ad69aaa4cd2a091faf2ac1aad93ebcf2a2a209c479c21549efb56e9e884711868206b092f65386064f22a66ed0afb6c76c50e40ee6a30b7"' :
                                            'id="xs-controllers-links-module-WorkspaceModule-d5c2f92c7694724b4ad69aaa4cd2a091faf2ac1aad93ebcf2a2a209c479c21549efb56e9e884711868206b092f65386064f22a66ed0afb6c76c50e40ee6a30b7"' }>
                                            <li class="link">
                                                <a href="controllers/WorkspaceContributorController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspaceContributorController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/WorkspaceController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspaceController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/WorkspaceMemberController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspaceMemberController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/WorkspaceOrgController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspaceOrgController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/WorkspaceRepoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspaceRepoController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/WorkspaceStatsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspaceStatsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-WorkspaceModule-d5c2f92c7694724b4ad69aaa4cd2a091faf2ac1aad93ebcf2a2a209c479c21549efb56e9e884711868206b092f65386064f22a66ed0afb6c76c50e40ee6a30b7"' : 'data-target="#xs-injectables-links-module-WorkspaceModule-d5c2f92c7694724b4ad69aaa4cd2a091faf2ac1aad93ebcf2a2a209c479c21549efb56e9e884711868206b092f65386064f22a66ed0afb6c76c50e40ee6a30b7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-WorkspaceModule-d5c2f92c7694724b4ad69aaa4cd2a091faf2ac1aad93ebcf2a2a209c479c21549efb56e9e884711868206b092f65386064f22a66ed0afb6c76c50e40ee6a30b7"' :
                                        'id="xs-injectables-links-module-WorkspaceModule-d5c2f92c7694724b4ad69aaa4cd2a091faf2ac1aad93ebcf2a2a209c479c21549efb56e9e884711868206b092f65386064f22a66ed0afb6c76c50e40ee6a30b7"' }>
                                        <li class="link">
                                            <a href="injectables/WorkspaceContributorsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspaceContributorsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WorkspaceMembersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspaceMembersService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WorkspaceOrgsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspaceOrgsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WorkspaceReposService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspaceReposService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WorkspaceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspaceService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WorkspaceStatsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkspaceStatsService</a>
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
                                    <a href="entities/DbBakedRepo.html" data-type="entity-link" >DbBakedRepo</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbCommitAuthors.html" data-type="entity-link" >DbCommitAuthors</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbCommits.html" data-type="entity-link" >DbCommits</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbContributionsProjects.html" data-type="entity-link" >DbContributionsProjects</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbContributionStatTimeframe.html" data-type="entity-link" >DbContributionStatTimeframe</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbContributorCategoryTimeframe.html" data-type="entity-link" >DbContributorCategoryTimeframe</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbCoupon.html" data-type="entity-link" >DbCoupon</a>
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
                                    <a href="entities/DbForkGitHubEventsHistogram.html" data-type="entity-link" >DbForkGitHubEventsHistogram</a>
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
                                    <a href="entities/DbIssueCommentGitHubEventsHistogram.html" data-type="entity-link" >DbIssueCommentGitHubEventsHistogram</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbIssuesGitHubEvents.html" data-type="entity-link" >DbIssuesGitHubEvents</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbIssuesGitHubEventsHistogram.html" data-type="entity-link" >DbIssuesGitHubEventsHistogram</a>
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
                                    <a href="entities/DbPullRequestGitHubEvents.html" data-type="entity-link" >DbPullRequestGitHubEvents</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbPullRequestGitHubEventsHistogram.html" data-type="entity-link" >DbPullRequestGitHubEventsHistogram</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbPullRequestReviewGitHubEvents.html" data-type="entity-link" >DbPullRequestReviewGitHubEvents</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbPullRequestReviewGitHubEventsHistogram.html" data-type="entity-link" >DbPullRequestReviewGitHubEventsHistogram</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbPushGitHubEvents.html" data-type="entity-link" >DbPushGitHubEvents</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbPushGitHubEventsHistogram.html" data-type="entity-link" >DbPushGitHubEventsHistogram</a>
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
                                    <a href="entities/DbUserList.html" data-type="entity-link" >DbUserList</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbUserListContributor.html" data-type="entity-link" >DbUserListContributor</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbUserListContributorStat.html" data-type="entity-link" >DbUserListContributorStat</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbUserNotification.html" data-type="entity-link" >DbUserNotification</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbUserOrganization.html" data-type="entity-link" >DbUserOrganization</a>
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
                                <li class="link">
                                    <a href="entities/DbWatchGitHubEventsHistogram.html" data-type="entity-link" >DbWatchGitHubEventsHistogram</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbWorkspace.html" data-type="entity-link" >DbWorkspace</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbWorkspaceContributor.html" data-type="entity-link" >DbWorkspaceContributor</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbWorkspaceInsight.html" data-type="entity-link" >DbWorkspaceInsight</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbWorkspaceMember.html" data-type="entity-link" >DbWorkspaceMember</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbWorkspaceOrg.html" data-type="entity-link" >DbWorkspaceOrg</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbWorkspaceRepo.html" data-type="entity-link" >DbWorkspaceRepo</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DbWorkspaceStats.html" data-type="entity-link" >DbWorkspaceStats</a>
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
                                <a href="classes/ApplyUserCouponDto.html" data-type="entity-link" >ApplyUserCouponDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BakeRepoDto.html" data-type="entity-link" >BakeRepoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseHistogramDto.html" data-type="entity-link" >BaseHistogramDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CollaboratorsDto.html" data-type="entity-link" >CollaboratorsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommitAuthorDto.html" data-type="entity-link" >CommitAuthorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommitsDto.html" data-type="entity-link" >CommitsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContributionPageMetaDto.html" data-type="entity-link" >ContributionPageMetaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContributionsByProjectDto.html" data-type="entity-link" >ContributionsByProjectDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContributionsPageDto.html" data-type="entity-link" >ContributionsPageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContributionsTimeframeDto.html" data-type="entity-link" >ContributionsTimeframeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Contributor.html" data-type="entity-link" >Contributor</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContributorPullRequestsDto.html" data-type="entity-link" >ContributorPullRequestsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBlogSummaryDto.html" data-type="entity-link" >CreateBlogSummaryDto</a>
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
                                <a href="classes/CreateIssueSummaryDto.html" data-type="entity-link" >CreateIssueSummaryDto</a>
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
                                <a href="classes/CreateUserListDto.html" data-type="entity-link" >CreateUserListDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateWorkspaceDto.html" data-type="entity-link" >CreateWorkspaceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseLoggerMiddleware.html" data-type="entity-link" >DatabaseLoggerMiddleware</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbFilteredUser.html" data-type="entity-link" >DbFilteredUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbPullRequestContributor.html" data-type="entity-link" >DbPullRequestContributor</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbTimezone.html" data-type="entity-link" >DbTimezone</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbTopUser.html" data-type="entity-link" >DbTopUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbUserHighlightReactionResponse.html" data-type="entity-link" >DbUserHighlightReactionResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbUserHighlightRepo.html" data-type="entity-link" >DbUserHighlightRepo</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbWorkspaceIssueStats.html" data-type="entity-link" >DbWorkspaceIssueStats</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbWorkspacePrStats.html" data-type="entity-link" >DbWorkspacePrStats</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbWorkspaceRepoStats.html" data-type="entity-link" >DbWorkspaceRepoStats</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteWorkspaceContributorsDto.html" data-type="entity-link" >DeleteWorkspaceContributorsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteWorkspaceMembersDto.html" data-type="entity-link" >DeleteWorkspaceMembersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteWorkspaceOrgsDto.html" data-type="entity-link" >DeleteWorkspaceOrgsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteWorkspaceReposDto.html" data-type="entity-link" >DeleteWorkspaceReposDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilteredUsersDto.html" data-type="entity-link" >FilteredUsersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterListContributorsDto.html" data-type="entity-link" >FilterListContributorsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterOptionsDto.html" data-type="entity-link" >FilterOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FollowManyUsersDto.html" data-type="entity-link" >FollowManyUsersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForksHistogramDto.html" data-type="entity-link" >ForksHistogramDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenerateCodeExplanationDto.html" data-type="entity-link" >GenerateCodeExplanationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenerateCodeRefactorSuggestionDto.html" data-type="entity-link" >GenerateCodeRefactorSuggestionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenerateCodeTestSuggestionDto.html" data-type="entity-link" >GenerateCodeTestSuggestionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeneratePullRequestDescriptionDto.html" data-type="entity-link" >GeneratePullRequestDescriptionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/HighlightOptionsDto.html" data-type="entity-link" >HighlightOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InsightDto.html" data-type="entity-link" >InsightDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InsightOptionsDto.html" data-type="entity-link" >InsightOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InsightPageOptionsDto.html" data-type="entity-link" >InsightPageOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IssueCommentsHistogramDto.html" data-type="entity-link" >IssueCommentsHistogramDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IssueHistogramDto.html" data-type="entity-link" >IssueHistogramDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewMember.html" data-type="entity-link" >NewMember</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewWorkspaceContributor.html" data-type="entity-link" >NewWorkspaceContributor</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewWorkspaceOrg.html" data-type="entity-link" >NewWorkspaceOrg</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewWorkspaceRepo.html" data-type="entity-link" >NewWorkspaceRepo</a>
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
                                <a href="classes/PullRequestContributorInsightsDto.html" data-type="entity-link" >PullRequestContributorInsightsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PullRequestContributorOptionsDto.html" data-type="entity-link" >PullRequestContributorOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PullRequestHistogramDto.html" data-type="entity-link" >PullRequestHistogramDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PullRequestPageOptionsDto.html" data-type="entity-link" >PullRequestPageOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PullRequestReviewHistogramDto.html" data-type="entity-link" >PullRequestReviewHistogramDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PushesHistogramDto.html" data-type="entity-link" >PushesHistogramDto</a>
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
                                <a href="classes/StarsHistogramDto.html" data-type="entity-link" >StarsHistogramDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SupabaseAuthDto.html" data-type="entity-link" >SupabaseAuthDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TopProjectsDto.html" data-type="entity-link" >TopProjectsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TopUsersDto.html" data-type="entity-link" >TopUsersDto</a>
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
                                <a href="classes/UpdateWorkspaceContributorsDto.html" data-type="entity-link" >UpdateWorkspaceContributorsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateWorkspaceDto.html" data-type="entity-link" >UpdateWorkspaceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateWorkspaceMemberDto.html" data-type="entity-link" >UpdateWorkspaceMemberDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateWorkspaceMembersDto.html" data-type="entity-link" >UpdateWorkspaceMembersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateWorkspaceOrgsDto.html" data-type="entity-link" >UpdateWorkspaceOrgsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateWorkspaceReposDto.html" data-type="entity-link" >UpdateWorkspaceReposDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserListMostActiveContributorsDto.html" data-type="entity-link" >UserListMostActiveContributorsDto</a>
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
                            <li class="link">
                                <a href="classes/VotedRepoDto.html" data-type="entity-link" >VotedRepoDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/WorkspaceStatsOptionsDto.html" data-type="entity-link" >WorkspaceStatsOptionsDto</a>
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
                                <a href="interfaces/PageMetaParameters.html" data-type="entity-link" >PageMetaParameters</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginationInput.html" data-type="entity-link" >PaginationInput</a>
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