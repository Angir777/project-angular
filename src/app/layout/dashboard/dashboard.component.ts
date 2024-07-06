import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { Subscription, filter } from 'rxjs';
import { LayoutService } from '../../services/layout/layout.service';
import { SidebarComponent } from './sidebar/sidebar.component';

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
  }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnDestroy {
  
    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    profileMenuOutsideClickListener: any;

    @ViewChild(SidebarComponent) appSidebar!: SidebarComponent;

    @ViewChild(HeaderComponent) appHeader!: HeaderComponent;

    private readonly localStorageKey = 'appTheme';

    constructor(
        public layoutService: LayoutService, 
        public renderer: Renderer2, 
        public router: Router
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = 
                        !(this.appSidebar.el.nativeElement.isSameNode(event.target) || 
                        this.appSidebar.el.nativeElement.contains(event.target) || 
                        this.appHeader.menuButton.nativeElement.isSameNode(event.target) || 
                        this.appHeader.menuButton.nativeElement.contains(event.target)
                    );
                    
                    if (isOutsideClicked) {
                        this.hideMenu();
                    }
                });
            }

            if (!this.profileMenuOutsideClickListener) {
                this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = 
                        !(this.appHeader.menu.nativeElement.isSameNode(event.target) || 
                        this.appHeader.menu.nativeElement.contains(event.target) || 
                        this.appHeader.topbarMenuButton.nativeElement.isSameNode(event.target) || 
                        this.appHeader.topbarMenuButton.nativeElement.contains(event.target)
                    );

                    if (isOutsideClicked) {
                        this.hideProfileMenu();
                    }
                });
            }

            if (this.layoutService.state.staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hideMenu();
                this.hideProfileMenu();
            });
    }

    hideMenu() {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    hideProfileMenu() {
    this.layoutService.state.profileSidebarVisible = false;
        if (this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener();
            this.profileMenuOutsideClickListener = null;
        }
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-theme-light': this.layoutService.config().colorScheme === 'light',
            'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
            'layout-overlay': this.layoutService.config().menuMode === 'overlay',
            'layout-static': this.layoutService.config().menuMode === 'static',
            'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
            'p-input-filled': this.layoutService.config().inputStyle === 'filled',
            'p-ripple-disabled': !this.layoutService.config().ripple
        }
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }

}
