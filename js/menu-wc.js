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
                                            'data-target="#controllers-links-module-ContributionModule-13c0fb0691321a270db42511df590cf65d552e755a661979f83512e7151ff793b4a42ca77dd14326a99aebd973065e56358a7aba5c9d6aaf0f58ab74e86c8fca"' : 'data-target="#xs-controllers-links-module-ContributionModule-13c0fb0691321a270db42511df590cf65d552e755a661979f83512e7151ff793b4a42ca77dd14326a99aebd973065e56358a7aba5c9d6aaf0f58ab74e86c8fca"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ContributionModule-13c0fb0691321a270db42511df590cf65d552e755a661979f83512e7151ff793b4a42ca77dd14326a99aebd973065e56358a7aba5c9d6aaf0f58ab74e86c8fca"' :
                                            'id="xs-controllers-links-module-ContributionModule-13c0fb0691321a270db42511df590cf65d552e755a661979f83512e7151ff793b4a42ca77dd14326a99aebd973065e56358a7aba5c9d6aaf0f58ab74e86c8fca"' }>
                                            <li class="link">
                                                <a href="controllers/RepoContributionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoContributionsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ContributionModule-13c0fb0691321a270db42511df590cf65d552e755a661979f83512e7151ff793b4a42ca77dd14326a99aebd973065e56358a7aba5c9d6aaf0f58ab74e86c8fca"' : 'data-target="#xs-injectables-links-module-ContributionModule-13c0fb0691321a270db42511df590cf65d552e755a661979f83512e7151ff793b4a42ca77dd14326a99aebd973065e56358a7aba5c9d6aaf0f58ab74e86c8fca"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ContributionModule-13c0fb0691321a270db42511df590cf65d552e755a661979f83512e7151ff793b4a42ca77dd14326a99aebd973065e56358a7aba5c9d6aaf0f58ab74e86c8fca"' :
                                        'id="xs-injectables-links-module-ContributionModule-13c0fb0691321a270db42511df590cf65d552e755a661979f83512e7151ff793b4a42ca77dd14326a99aebd973065e56358a7aba5c9d6aaf0f58ab74e86c8fca"' }>
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
                                            'data-target="#controllers-links-module-ContributorModule-d4675e22d52b0f955173b670c94a41113af24f8cad89226d09ef547ff8e28e1cc9145498e1161f602fbcb9a0980d72573cf09761abb51d88ba17dbd4b06df0f8"' : 'data-target="#xs-controllers-links-module-ContributorModule-d4675e22d52b0f955173b670c94a41113af24f8cad89226d09ef547ff8e28e1cc9145498e1161f602fbcb9a0980d72573cf09761abb51d88ba17dbd4b06df0f8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ContributorModule-d4675e22d52b0f955173b670c94a41113af24f8cad89226d09ef547ff8e28e1cc9145498e1161f602fbcb9a0980d72573cf09761abb51d88ba17dbd4b06df0f8"' :
                                            'id="xs-controllers-links-module-ContributorModule-d4675e22d52b0f955173b670c94a41113af24f8cad89226d09ef547ff8e28e1cc9145498e1161f602fbcb9a0980d72573cf09761abb51d88ba17dbd4b06df0f8"' }>
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
                                            'data-target="#controllers-links-module-EndorsementModule-d83a5993f7ec8dbd9f3c2cd91f4143a8f3ae98056a8525b7bf9e6dd402997c45e936fb9a5bc27a8be86721d5248b5a3086f98f07cd2cd11fbfe04c717b11f670"' : 'data-target="#xs-controllers-links-module-EndorsementModule-d83a5993f7ec8dbd9f3c2cd91f4143a8f3ae98056a8525b7bf9e6dd402997c45e936fb9a5bc27a8be86721d5248b5a3086f98f07cd2cd11fbfe04c717b11f670"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EndorsementModule-d83a5993f7ec8dbd9f3c2cd91f4143a8f3ae98056a8525b7bf9e6dd402997c45e936fb9a5bc27a8be86721d5248b5a3086f98f07cd2cd11fbfe04c717b11f670"' :
                                            'id="xs-controllers-links-module-EndorsementModule-d83a5993f7ec8dbd9f3c2cd91f4143a8f3ae98056a8525b7bf9e6dd402997c45e936fb9a5bc27a8be86721d5248b5a3086f98f07cd2cd11fbfe04c717b11f670"' }>
                                            <li class="link">
                                                <a href="controllers/EndorsementController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EndorsementController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EndorsementModule-d83a5993f7ec8dbd9f3c2cd91f4143a8f3ae98056a8525b7bf9e6dd402997c45e936fb9a5bc27a8be86721d5248b5a3086f98f07cd2cd11fbfe04c717b11f670"' : 'data-target="#xs-injectables-links-module-EndorsementModule-d83a5993f7ec8dbd9f3c2cd91f4143a8f3ae98056a8525b7bf9e6dd402997c45e936fb9a5bc27a8be86721d5248b5a3086f98f07cd2cd11fbfe04c717b11f670"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EndorsementModule-d83a5993f7ec8dbd9f3c2cd91f4143a8f3ae98056a8525b7bf9e6dd402997c45e936fb9a5bc27a8be86721d5248b5a3086f98f07cd2cd11fbfe04c717b11f670"' :
                                        'id="xs-injectables-links-module-EndorsementModule-d83a5993f7ec8dbd9f3c2cd91f4143a8f3ae98056a8525b7bf9e6dd402997c45e936fb9a5bc27a8be86721d5248b5a3086f98f07cd2cd11fbfe04c717b11f670"' }>
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
                                            'data-target="#controllers-links-module-HighlightModule-414167a4b86c5f429b7c68a2925ced47f449e9de3729d080f81b31dbed084cecd3ae48ac57dc0ca15aa1049396f5d09d3f1991aab0dcdbbf47e7e99d31224536"' : 'data-target="#xs-controllers-links-module-HighlightModule-414167a4b86c5f429b7c68a2925ced47f449e9de3729d080f81b31dbed084cecd3ae48ac57dc0ca15aa1049396f5d09d3f1991aab0dcdbbf47e7e99d31224536"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HighlightModule-414167a4b86c5f429b7c68a2925ced47f449e9de3729d080f81b31dbed084cecd3ae48ac57dc0ca15aa1049396f5d09d3f1991aab0dcdbbf47e7e99d31224536"' :
                                            'id="xs-controllers-links-module-HighlightModule-414167a4b86c5f429b7c68a2925ced47f449e9de3729d080f81b31dbed084cecd3ae48ac57dc0ca15aa1049396f5d09d3f1991aab0dcdbbf47e7e99d31224536"' }>
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
                                            'data-target="#controllers-links-module-InsightsModule-7f0662dadb1214ccee6117b5759a8f2e692caab98eb010ef1d0a048cbc492e35636ef90608d095701e6ea20abb8c31fede6c84e7c3ae250f54d4cec249e14eaa"' : 'data-target="#xs-controllers-links-module-InsightsModule-7f0662dadb1214ccee6117b5759a8f2e692caab98eb010ef1d0a048cbc492e35636ef90608d095701e6ea20abb8c31fede6c84e7c3ae250f54d4cec249e14eaa"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-InsightsModule-7f0662dadb1214ccee6117b5759a8f2e692caab98eb010ef1d0a048cbc492e35636ef90608d095701e6ea20abb8c31fede6c84e7c3ae250f54d4cec249e14eaa"' :
                                            'id="xs-controllers-links-module-InsightsModule-7f0662dadb1214ccee6117b5759a8f2e692caab98eb010ef1d0a048cbc492e35636ef90608d095701e6ea20abb8c31fede6c84e7c3ae250f54d4cec249e14eaa"' }>
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
                                        'data-target="#injectables-links-module-InsightsModule-7f0662dadb1214ccee6117b5759a8f2e692caab98eb010ef1d0a048cbc492e35636ef90608d095701e6ea20abb8c31fede6c84e7c3ae250f54d4cec249e14eaa"' : 'data-target="#xs-injectables-links-module-InsightsModule-7f0662dadb1214ccee6117b5759a8f2e692caab98eb010ef1d0a048cbc492e35636ef90608d095701e6ea20abb8c31fede6c84e7c3ae250f54d4cec249e14eaa"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InsightsModule-7f0662dadb1214ccee6117b5759a8f2e692caab98eb010ef1d0a048cbc492e35636ef90608d095701e6ea20abb8c31fede6c84e7c3ae250f54d4cec249e14eaa"' :
                                        'id="xs-injectables-links-module-InsightsModule-7f0662dadb1214ccee6117b5759a8f2e692caab98eb010ef1d0a048cbc492e35636ef90608d095701e6ea20abb8c31fede6c84e7c3ae250f54d4cec249e14eaa"' }>
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
                                <a href="modules/PullRequestModule.html" data-type="entity-link" >PullRequestModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PullRequestModule-1c6f82e59d9278c43331dc406e4abaebbc8dd64b53584a80119d14fae4ad5bfb19b66563c60f4378a5cfad35cd0a50b5b2cb7e0a34e8a2bb7192f4ee5c443d33"' : 'data-target="#xs-controllers-links-module-PullRequestModule-1c6f82e59d9278c43331dc406e4abaebbc8dd64b53584a80119d14fae4ad5bfb19b66563c60f4378a5cfad35cd0a50b5b2cb7e0a34e8a2bb7192f4ee5c443d33"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PullRequestModule-1c6f82e59d9278c43331dc406e4abaebbc8dd64b53584a80119d14fae4ad5bfb19b66563c60f4378a5cfad35cd0a50b5b2cb7e0a34e8a2bb7192f4ee5c443d33"' :
                                            'id="xs-controllers-links-module-PullRequestModule-1c6f82e59d9278c43331dc406e4abaebbc8dd64b53584a80119d14fae4ad5bfb19b66563c60f4378a5cfad35cd0a50b5b2cb7e0a34e8a2bb7192f4ee5c443d33"' }>
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
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PullRequestModule-1c6f82e59d9278c43331dc406e4abaebbc8dd64b53584a80119d14fae4ad5bfb19b66563c60f4378a5cfad35cd0a50b5b2cb7e0a34e8a2bb7192f4ee5c443d33"' : 'data-target="#xs-injectables-links-module-PullRequestModule-1c6f82e59d9278c43331dc406e4abaebbc8dd64b53584a80119d14fae4ad5bfb19b66563c60f4378a5cfad35cd0a50b5b2cb7e0a34e8a2bb7192f4ee5c443d33"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PullRequestModule-1c6f82e59d9278c43331dc406e4abaebbc8dd64b53584a80119d14fae4ad5bfb19b66563c60f4378a5cfad35cd0a50b5b2cb7e0a34e8a2bb7192f4ee5c443d33"' :
                                        'id="xs-injectables-links-module-PullRequestModule-1c6f82e59d9278c43331dc406e4abaebbc8dd64b53584a80119d14fae4ad5bfb19b66563c60f4378a5cfad35cd0a50b5b2cb7e0a34e8a2bb7192f4ee5c443d33"' }>
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
                                            'data-target="#controllers-links-module-StargazeModule-6deba296d4a2e99ec4ac74a38552530bd5a9cb838f6ac5a4daa1a5a53483db8e3717a5b51306ee17961a09a9c4305b2dfc3c2afeab81804c4825190f5277cb34"' : 'data-target="#xs-controllers-links-module-StargazeModule-6deba296d4a2e99ec4ac74a38552530bd5a9cb838f6ac5a4daa1a5a53483db8e3717a5b51306ee17961a09a9c4305b2dfc3c2afeab81804c4825190f5277cb34"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StargazeModule-6deba296d4a2e99ec4ac74a38552530bd5a9cb838f6ac5a4daa1a5a53483db8e3717a5b51306ee17961a09a9c4305b2dfc3c2afeab81804c4825190f5277cb34"' :
                                            'id="xs-controllers-links-module-StargazeModule-6deba296d4a2e99ec4ac74a38552530bd5a9cb838f6ac5a4daa1a5a53483db8e3717a5b51306ee17961a09a9c4305b2dfc3c2afeab81804c4825190f5277cb34"' }>
                                            <li class="link">
                                                <a href="controllers/RepoStargazeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoStargazeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StargazeModule-6deba296d4a2e99ec4ac74a38552530bd5a9cb838f6ac5a4daa1a5a53483db8e3717a5b51306ee17961a09a9c4305b2dfc3c2afeab81804c4825190f5277cb34"' : 'data-target="#xs-injectables-links-module-StargazeModule-6deba296d4a2e99ec4ac74a38552530bd5a9cb838f6ac5a4daa1a5a53483db8e3717a5b51306ee17961a09a9c4305b2dfc3c2afeab81804c4825190f5277cb34"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StargazeModule-6deba296d4a2e99ec4ac74a38552530bd5a9cb838f6ac5a4daa1a5a53483db8e3717a5b51306ee17961a09a9c4305b2dfc3c2afeab81804c4825190f5277cb34"' :
                                        'id="xs-injectables-links-module-StargazeModule-6deba296d4a2e99ec4ac74a38552530bd5a9cb838f6ac5a4daa1a5a53483db8e3717a5b51306ee17961a09a9c4305b2dfc3c2afeab81804c4825190f5277cb34"' }>
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
                                            'data-target="#controllers-links-module-StarModule-8c3abe716f7dcd9532eca2c8e638787a725ee0df179e86c04cf5d6fdc2473fc6eb338d348a1868195f654cccd16fc7ec2b16a7aa4852b707fdfc96ff0d8365c5"' : 'data-target="#xs-controllers-links-module-StarModule-8c3abe716f7dcd9532eca2c8e638787a725ee0df179e86c04cf5d6fdc2473fc6eb338d348a1868195f654cccd16fc7ec2b16a7aa4852b707fdfc96ff0d8365c5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StarModule-8c3abe716f7dcd9532eca2c8e638787a725ee0df179e86c04cf5d6fdc2473fc6eb338d348a1868195f654cccd16fc7ec2b16a7aa4852b707fdfc96ff0d8365c5"' :
                                            'id="xs-controllers-links-module-StarModule-8c3abe716f7dcd9532eca2c8e638787a725ee0df179e86c04cf5d6fdc2473fc6eb338d348a1868195f654cccd16fc7ec2b16a7aa4852b707fdfc96ff0d8365c5"' }>
                                            <li class="link">
                                                <a href="controllers/RepoStarController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoStarController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StarModule-8c3abe716f7dcd9532eca2c8e638787a725ee0df179e86c04cf5d6fdc2473fc6eb338d348a1868195f654cccd16fc7ec2b16a7aa4852b707fdfc96ff0d8365c5"' : 'data-target="#xs-injectables-links-module-StarModule-8c3abe716f7dcd9532eca2c8e638787a725ee0df179e86c04cf5d6fdc2473fc6eb338d348a1868195f654cccd16fc7ec2b16a7aa4852b707fdfc96ff0d8365c5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StarModule-8c3abe716f7dcd9532eca2c8e638787a725ee0df179e86c04cf5d6fdc2473fc6eb338d348a1868195f654cccd16fc7ec2b16a7aa4852b707fdfc96ff0d8365c5"' :
                                        'id="xs-injectables-links-module-StarModule-8c3abe716f7dcd9532eca2c8e638787a725ee0df179e86c04cf5d6fdc2473fc6eb338d348a1868195f654cccd16fc7ec2b16a7aa4852b707fdfc96ff0d8365c5"' }>
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
                                            'data-target="#controllers-links-module-StripeWebHookModule-a456153a5ac1a66d45b6dfa1ecf394cadac97e14025f49b75992a503200b7f563d60d87822435a49ff0bb21bde522a661c26ab9f6ba46e411d1c502d411953dd"' : 'data-target="#xs-controllers-links-module-StripeWebHookModule-a456153a5ac1a66d45b6dfa1ecf394cadac97e14025f49b75992a503200b7f563d60d87822435a49ff0bb21bde522a661c26ab9f6ba46e411d1c502d411953dd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StripeWebHookModule-a456153a5ac1a66d45b6dfa1ecf394cadac97e14025f49b75992a503200b7f563d60d87822435a49ff0bb21bde522a661c26ab9f6ba46e411d1c502d411953dd"' :
                                            'id="xs-controllers-links-module-StripeWebHookModule-a456153a5ac1a66d45b6dfa1ecf394cadac97e14025f49b75992a503200b7f563d60d87822435a49ff0bb21bde522a661c26ab9f6ba46e411d1c502d411953dd"' }>
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
                                            'data-target="#controllers-links-module-SubmitModule-096299acc8055120fd86bc04771f873571500d87db2111bfa9ac5e3302f1ee5da4e5a71dc66f8952bc35038434fd62cf45039b7ae4464ada5eefbebc909862f5"' : 'data-target="#xs-controllers-links-module-SubmitModule-096299acc8055120fd86bc04771f873571500d87db2111bfa9ac5e3302f1ee5da4e5a71dc66f8952bc35038434fd62cf45039b7ae4464ada5eefbebc909862f5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SubmitModule-096299acc8055120fd86bc04771f873571500d87db2111bfa9ac5e3302f1ee5da4e5a71dc66f8952bc35038434fd62cf45039b7ae4464ada5eefbebc909862f5"' :
                                            'id="xs-controllers-links-module-SubmitModule-096299acc8055120fd86bc04771f873571500d87db2111bfa9ac5e3302f1ee5da4e5a71dc66f8952bc35038434fd62cf45039b7ae4464ada5eefbebc909862f5"' }>
                                            <li class="link">
                                                <a href="controllers/RepoSubmitController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoSubmitController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SubmitModule-096299acc8055120fd86bc04771f873571500d87db2111bfa9ac5e3302f1ee5da4e5a71dc66f8952bc35038434fd62cf45039b7ae4464ada5eefbebc909862f5"' : 'data-target="#xs-injectables-links-module-SubmitModule-096299acc8055120fd86bc04771f873571500d87db2111bfa9ac5e3302f1ee5da4e5a71dc66f8952bc35038434fd62cf45039b7ae4464ada5eefbebc909862f5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SubmitModule-096299acc8055120fd86bc04771f873571500d87db2111bfa9ac5e3302f1ee5da4e5a71dc66f8952bc35038434fd62cf45039b7ae4464ada5eefbebc909862f5"' :
                                        'id="xs-injectables-links-module-SubmitModule-096299acc8055120fd86bc04771f873571500d87db2111bfa9ac5e3302f1ee5da4e5a71dc66f8952bc35038434fd62cf45039b7ae4464ada5eefbebc909862f5"' }>
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
                                            'data-target="#controllers-links-module-UserModule-81ec8acb2a15731a7c8051f8ad4235149054bcd516edafdd349339c013f849cd3053d162192b264c34b3b7122d11473d6b4a4199e1ecb9162552af22418dd066"' : 'data-target="#xs-controllers-links-module-UserModule-81ec8acb2a15731a7c8051f8ad4235149054bcd516edafdd349339c013f849cd3053d162192b264c34b3b7122d11473d6b4a4199e1ecb9162552af22418dd066"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-81ec8acb2a15731a7c8051f8ad4235149054bcd516edafdd349339c013f849cd3053d162192b264c34b3b7122d11473d6b4a4199e1ecb9162552af22418dd066"' :
                                            'id="xs-controllers-links-module-UserModule-81ec8acb2a15731a7c8051f8ad4235149054bcd516edafdd349339c013f849cd3053d162192b264c34b3b7122d11473d6b4a4199e1ecb9162552af22418dd066"' }>
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
                                            <li class="link">
                                                <a href="controllers/UserRecommendationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserRecommendationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-81ec8acb2a15731a7c8051f8ad4235149054bcd516edafdd349339c013f849cd3053d162192b264c34b3b7122d11473d6b4a4199e1ecb9162552af22418dd066"' : 'data-target="#xs-injectables-links-module-UserModule-81ec8acb2a15731a7c8051f8ad4235149054bcd516edafdd349339c013f849cd3053d162192b264c34b3b7122d11473d6b4a4199e1ecb9162552af22418dd066"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-81ec8acb2a15731a7c8051f8ad4235149054bcd516edafdd349339c013f849cd3053d162192b264c34b3b7122d11473d6b4a4199e1ecb9162552af22418dd066"' :
                                        'id="xs-injectables-links-module-UserModule-81ec8acb2a15731a7c8051f8ad4235149054bcd516edafdd349339c013f849cd3053d162192b264c34b3b7122d11473d6b4a4199e1ecb9162552af22418dd066"' }>
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
                                            'data-target="#controllers-links-module-VoteModule-d6c092b75ab6350b6e1664448c4aba478a033f07f802176a5d967d021a4fbef12a4a556cecd30362b5222f6ed208c41ffff6059bc5eca73fd94503c944ef9eeb"' : 'data-target="#xs-controllers-links-module-VoteModule-d6c092b75ab6350b6e1664448c4aba478a033f07f802176a5d967d021a4fbef12a4a556cecd30362b5222f6ed208c41ffff6059bc5eca73fd94503c944ef9eeb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-VoteModule-d6c092b75ab6350b6e1664448c4aba478a033f07f802176a5d967d021a4fbef12a4a556cecd30362b5222f6ed208c41ffff6059bc5eca73fd94503c944ef9eeb"' :
                                            'id="xs-controllers-links-module-VoteModule-d6c092b75ab6350b6e1664448c4aba478a033f07f802176a5d967d021a4fbef12a4a556cecd30362b5222f6ed208c41ffff6059bc5eca73fd94503c944ef9eeb"' }>
                                            <li class="link">
                                                <a href="controllers/RepoVoteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoVoteController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-VoteModule-d6c092b75ab6350b6e1664448c4aba478a033f07f802176a5d967d021a4fbef12a4a556cecd30362b5222f6ed208c41ffff6059bc5eca73fd94503c944ef9eeb"' : 'data-target="#xs-injectables-links-module-VoteModule-d6c092b75ab6350b6e1664448c4aba478a033f07f802176a5d967d021a4fbef12a4a556cecd30362b5222f6ed208c41ffff6059bc5eca73fd94503c944ef9eeb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VoteModule-d6c092b75ab6350b6e1664448c4aba478a033f07f802176a5d967d021a4fbef12a4a556cecd30362b5222f6ed208c41ffff6059bc5eca73fd94503c944ef9eeb"' :
                                        'id="xs-injectables-links-module-VoteModule-d6c092b75ab6350b6e1664448c4aba478a033f07f802176a5d967d021a4fbef12a4a556cecd30362b5222f6ed208c41ffff6059bc5eca73fd94503c944ef9eeb"' }>
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
                                <a href="classes/DbTopUser.html" data-type="entity-link" >DbTopUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbUserHighlightReactionResponse.html" data-type="entity-link" >DbUserHighlightReactionResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/DbUserHighlightRepo.html" data-type="entity-link" >DbUserHighlightRepo</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterOptionsDto.html" data-type="entity-link" >FilterOptionsDto</a>
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
                                <a href="classes/PullRequestContributorInsightsDto.html" data-type="entity-link" >PullRequestContributorInsightsDto</a>
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