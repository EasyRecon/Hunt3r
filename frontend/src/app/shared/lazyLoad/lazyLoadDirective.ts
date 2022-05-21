import { AfterViewInit, Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable,fromEvent,map } from 'rxjs';
import {SubdomainsService} from '../../core/subdomains/subdomains.service'
@Directive({
  selector: 'img[appLazyLoad]'
})
export class LazyLoadDirective implements AfterViewInit {
  @HostBinding('attr.src') srcAttr:any = null;
  @Input() src: string='';

  constructor(private el: ElementRef,private subdomainsService:SubdomainsService,private domSanitizer: DomSanitizer) {}

  ngAfterViewInit() {
    console.log(123123123)
    this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
    console.log(this.src)
  }

  private canLazyLoad() {
    return window && 'IntersectionObserver' in window;
  }

  private lazyLoadImage() {
    console.log(123)
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.loadImage();
          obs.unobserve(this.el.nativeElement);
        }
      });
    });
    obs.observe(this.el.nativeElement);
  }

  private loadImage() {
    this.srcAttr=this.src
    this.srcAttr='/assets/img/loading.gif'
    this.subdomainsService.getScreenshot(parseInt(this.src)).subscribe(result=>{
      this.toBase64(result).subscribe( data => {
        this.srcAttr = this.domSanitizer.bypassSecurityTrustUrl(data)
      })

    },(err)=> {
      this.srcAttr = '/assets/img/not-found.png'
    })
  }
  toBase64(blob: Blob): Observable<string> {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return fromEvent(reader, 'load')
      .pipe(map(() => (reader.result as string)))
}
}