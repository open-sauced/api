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
                                            'data-target="#controllers-links-module-RepoModule-20e54c3d26dbcb4c3c6532d604f6c24299eff681c91423431cf24a8b4e0a6275f97fbc286391161c97ed66de7d841eabf5a88fb9ef85764408410a7536e60d4e"' : 'data-target="#xs-controllers-links-module-RepoModule-20e54c3d26dbcb4c3c6532d604f6c24299eff681c91423431cf24a8b4e0a6275f97fbc286391161c97ed66de7d841eabf5a88fb9ef85764408410a7536e60d4e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RepoModule-20e54c3d26dbcb4c3c6532d604f6c24299eff681c91423431cf24a8b4e0a6275f97fbc286391161c97ed66de7d841eabf5a88fb9ef85764408410a7536e60d4e"' :
                                            'id="xs-controllers-links-module-RepoModule-20e54c3d26dbcb4c3c6532d604f6c24299eff681c91423431cf24a8b4e0a6275f97fbc286391161c97ed66de7d841eabf5a88fb9ef85764408410a7536e60d4e"' }>
                                            <li class="link">
                                                <a href="controllers/RepoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RepoModule-20e54c3d26dbcb4c3c6532d604f6c24299eff681c91423431cf24a8b4e0a6275f97fbc286391161c97ed66de7d841eabf5a88fb9ef85764408410a7536e60d4e"' : 'data-target="#xs-injectables-links-module-RepoModule-20e54c3d26dbcb4c3c6532d604f6c24299eff681c91423431cf24a8b4e0a6275f97fbc286391161c97ed66de7d841eabf5a88fb9ef85764408410a7536e60d4e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RepoModule-20e54c3d26dbcb4c3c6532d604f6c24299eff681c91423431cf24a8b4e0a6275f97fbc286391161c97ed66de7d841eabf5a88fb9ef85764408410a7536e60d4e"' :
                                        'id="xs-injectables-links-module-RepoModule-20e54c3d26dbcb4c3c6532d604f6c24299eff681c91423431cf24a8b4e0a6275f97fbc286391161c97ed66de7d841eabf5a88fb9ef85764408410a7536e60d4e"' }>
                                        <li class="link">
                                            <a href="injectables/RepoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VoteModule.html" data-type="entity-link" >VoteModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-VoteModule-99f7f50ba1dbe0289d4a3e9b593d1b807eaa6acced3daf4961d1703a93948fea9b35e288aeb2c8218ad06d51ea4f6232ea0682c02cd351a17472c8234d98aead"' : 'data-target="#xs-controllers-links-module-VoteModule-99f7f50ba1dbe0289d4a3e9b593d1b807eaa6acced3daf4961d1703a93948fea9b35e288aeb2c8218ad06d51ea4f6232ea0682c02cd351a17472c8234d98aead"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-VoteModule-99f7f50ba1dbe0289d4a3e9b593d1b807eaa6acced3daf4961d1703a93948fea9b35e288aeb2c8218ad06d51ea4f6232ea0682c02cd351a17472c8234d98aead"' :
                                            'id="xs-controllers-links-module-VoteModule-99f7f50ba1dbe0289d4a3e9b593d1b807eaa6acced3daf4961d1703a93948fea9b35e288aeb2c8218ad06d51ea4f6232ea0682c02cd351a17472c8234d98aead"' }>
                                            <li class="link">
                                                <a href="controllers/RepoVoteController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RepoVoteController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-VoteModule-99f7f50ba1dbe0289d4a3e9b593d1b807eaa6acced3daf4961d1703a93948fea9b35e288aeb2c8218ad06d51ea4f6232ea0682c02cd351a17472c8234d98aead"' : 'data-target="#xs-injectables-links-module-VoteModule-99f7f50ba1dbe0289d4a3e9b593d1b807eaa6acced3daf4961d1703a93948fea9b35e288aeb2c8218ad06d51ea4f6232ea0682c02cd351a17472c8234d98aead"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VoteModule-99f7f50ba1dbe0289d4a3e9b593d1b807eaa6acced3daf4961d1703a93948fea9b35e288aeb2c8218ad06d51ea4f6232ea0682c02cd351a17472c8234d98aead"' :
                                        'id="xs-injectables-links-module-VoteModule-99f7f50ba1dbe0289d4a3e9b593d1b807eaa6acced3daf4961d1703a93948fea9b35e288aeb2c8218ad06d51ea4f6232ea0682c02cd351a17472c8234d98aead"' }>
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
                                    <a href="entities/Contribution.html" data-type="entity-link" >Contribution</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Repo.html" data-type="entity-link" >Repo</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepoToUserStargazers.html" data-type="entity-link" >RepoToUserStargazers</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepoToUserStars.html" data-type="entity-link" >RepoToUserStars</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepoToUserSubmissions.html" data-type="entity-link" >RepoToUserSubmissions</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RepoToUserVotes.html" data-type="entity-link" >RepoToUserVotes</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
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