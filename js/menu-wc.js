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
                    <a href="index.html" data-type="index-link">api.opensauced.pizza documentation</a>
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
                                            'data-target="#controllers-links-module-AuthModule-2a67ba8da467cb93e80240468922d2627cdb5be28e55c88cddaf44e7d0236c5692ae55374a2a4a2570d6c821ee22c9397007b5bc8a91d7e28b27343f543b7e05"' : 'data-target="#xs-controllers-links-module-AuthModule-2a67ba8da467cb93e80240468922d2627cdb5be28e55c88cddaf44e7d0236c5692ae55374a2a4a2570d6c821ee22c9397007b5bc8a91d7e28b27343f543b7e05"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-2a67ba8da467cb93e80240468922d2627cdb5be28e55c88cddaf44e7d0236c5692ae55374a2a4a2570d6c821ee22c9397007b5bc8a91d7e28b27343f543b7e05"' :
                                            'id="xs-controllers-links-module-AuthModule-2a67ba8da467cb93e80240468922d2627cdb5be28e55c88cddaf44e7d0236c5692ae55374a2a4a2570d6c821ee22c9397007b5bc8a91d7e28b27343f543b7e05"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-2a67ba8da467cb93e80240468922d2627cdb5be28e55c88cddaf44e7d0236c5692ae55374a2a4a2570d6c821ee22c9397007b5bc8a91d7e28b27343f543b7e05"' : 'data-target="#xs-injectables-links-module-AuthModule-2a67ba8da467cb93e80240468922d2627cdb5be28e55c88cddaf44e7d0236c5692ae55374a2a4a2570d6c821ee22c9397007b5bc8a91d7e28b27343f543b7e05"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-2a67ba8da467cb93e80240468922d2627cdb5be28e55c88cddaf44e7d0236c5692ae55374a2a4a2570d6c821ee22c9397007b5bc8a91d7e28b27343f543b7e05"' :
                                        'id="xs-injectables-links-module-AuthModule-2a67ba8da467cb93e80240468922d2627cdb5be28e55c88cddaf44e7d0236c5692ae55374a2a4a2570d6c821ee22c9397007b5bc8a91d7e28b27343f543b7e05"' }>
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
                                            'data-target="#controllers-links-module-StargazeModule-65bea1bba91134f8cf911edf624b191765eb64997ba465d02e1ba7c470a997116af9e6c0e885ac4c610693ea9de03cae99ec504d7f61bb71ed42c6156cedda2b"' : 'data-target="#xs-controllers-links-module-StargazeModule-65bea1bba91134f8cf911edf624b191765eb64997ba465d02e1ba7c470a997116af9e6c0e885ac4c610693ea9de03cae99ec504d7f61bb71ed42c6156cedda2b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StargazeModule-65bea1bba91134f8cf911edf624b191765eb64997ba465d02e1ba7c470a997116af9e6c0e885ac4c610693ea9de03cae99ec504d7f61bb71ed42c6156cedda2b"' :
                                            'id="xs-controllers-links-module-StargazeModule-65bea1bba91134f8cf911edf624b191765eb64997ba465d02e1ba7c470a997116af9e6c0e885ac4c610693ea9de03cae99ec504d7f61bb71ed42c6156cedda2b"' }>
                                            <li class="link">
                                                <a href="controllers/RepoStargazeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoStargazeController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StargazeModule-65bea1bba91134f8cf911edf624b191765eb64997ba465d02e1ba7c470a997116af9e6c0e885ac4c610693ea9de03cae99ec504d7f61bb71ed42c6156cedda2b"' : 'data-target="#xs-injectables-links-module-StargazeModule-65bea1bba91134f8cf911edf624b191765eb64997ba465d02e1ba7c470a997116af9e6c0e885ac4c610693ea9de03cae99ec504d7f61bb71ed42c6156cedda2b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StargazeModule-65bea1bba91134f8cf911edf624b191765eb64997ba465d02e1ba7c470a997116af9e6c0e885ac4c610693ea9de03cae99ec504d7f61bb71ed42c6156cedda2b"' :
                                        'id="xs-injectables-links-module-StargazeModule-65bea1bba91134f8cf911edf624b191765eb64997ba465d02e1ba7c470a997116af9e6c0e885ac4c610693ea9de03cae99ec504d7f61bb71ed42c6156cedda2b"' }>
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
                                            'data-target="#controllers-links-module-StarModule-de51312a7c6f4ad36a53dd463ec71215e6e6908fa7a210c77802ed192febc9742a46117bdc2d1899018ca7fe16fd618c10f8c5594c229b2d31deceb360da6bf1"' : 'data-target="#xs-controllers-links-module-StarModule-de51312a7c6f4ad36a53dd463ec71215e6e6908fa7a210c77802ed192febc9742a46117bdc2d1899018ca7fe16fd618c10f8c5594c229b2d31deceb360da6bf1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StarModule-de51312a7c6f4ad36a53dd463ec71215e6e6908fa7a210c77802ed192febc9742a46117bdc2d1899018ca7fe16fd618c10f8c5594c229b2d31deceb360da6bf1"' :
                                            'id="xs-controllers-links-module-StarModule-de51312a7c6f4ad36a53dd463ec71215e6e6908fa7a210c77802ed192febc9742a46117bdc2d1899018ca7fe16fd618c10f8c5594c229b2d31deceb360da6bf1"' }>
                                            <li class="link">
                                                <a href="controllers/RepoStarController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoStarController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StarModule-de51312a7c6f4ad36a53dd463ec71215e6e6908fa7a210c77802ed192febc9742a46117bdc2d1899018ca7fe16fd618c10f8c5594c229b2d31deceb360da6bf1"' : 'data-target="#xs-injectables-links-module-StarModule-de51312a7c6f4ad36a53dd463ec71215e6e6908fa7a210c77802ed192febc9742a46117bdc2d1899018ca7fe16fd618c10f8c5594c229b2d31deceb360da6bf1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StarModule-de51312a7c6f4ad36a53dd463ec71215e6e6908fa7a210c77802ed192febc9742a46117bdc2d1899018ca7fe16fd618c10f8c5594c229b2d31deceb360da6bf1"' :
                                        'id="xs-injectables-links-module-StarModule-de51312a7c6f4ad36a53dd463ec71215e6e6908fa7a210c77802ed192febc9742a46117bdc2d1899018ca7fe16fd618c10f8c5594c229b2d31deceb360da6bf1"' }>
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
                                <a href="modules/VoteModule.html" data-type="entity-link" >VoteModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-VoteModule-a3318e54c11ed52613a64999ed0b309affae94d6d8ff93c9dfbec893f5f7d88203fe7490bc7f7ab6d5849356c975ee4e5745402df8e428d40763aad7a2ab5f47"' : 'data-target="#xs-controllers-links-module-VoteModule-a3318e54c11ed52613a64999ed0b309affae94d6d8ff93c9dfbec893f5f7d88203fe7490bc7f7ab6d5849356c975ee4e5745402df8e428d40763aad7a2ab5f47"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-VoteModule-a3318e54c11ed52613a64999ed0b309affae94d6d8ff93c9dfbec893f5f7d88203fe7490bc7f7ab6d5849356c975ee4e5745402df8e428d40763aad7a2ab5f47"' :
                                            'id="xs-controllers-links-module-VoteModule-a3318e54c11ed52613a64999ed0b309affae94d6d8ff93c9dfbec893f5f7d88203fe7490bc7f7ab6d5849356c975ee4e5745402df8e428d40763aad7a2ab5f47"' }>
                                            <li class="link">
                                                <a href="controllers/RepoVoteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoVoteController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-VoteModule-a3318e54c11ed52613a64999ed0b309affae94d6d8ff93c9dfbec893f5f7d88203fe7490bc7f7ab6d5849356c975ee4e5745402df8e428d40763aad7a2ab5f47"' : 'data-target="#xs-injectables-links-module-VoteModule-a3318e54c11ed52613a64999ed0b309affae94d6d8ff93c9dfbec893f5f7d88203fe7490bc7f7ab6d5849356c975ee4e5745402df8e428d40763aad7a2ab5f47"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VoteModule-a3318e54c11ed52613a64999ed0b309affae94d6d8ff93c9dfbec893f5f7d88203fe7490bc7f7ab6d5849356c975ee4e5745402df8e428d40763aad7a2ab5f47"' :
                                        'id="xs-injectables-links-module-VoteModule-a3318e54c11ed52613a64999ed0b309affae94d6d8ff93c9dfbec893f5f7d88203fe7490bc7f7ab6d5849356c975ee4e5745402df8e428d40763aad7a2ab5f47"' }>
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
                                <a href="classes/SupabaseAuthResponse.html" data-type="entity-link" >SupabaseAuthResponse</a>
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