//
//  DemoUIView.h
//  RNToastModule
//
//  Created by 名赫 on 2018/1/10.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#ifndef DemoUIView_h
#define DemoUIView_h

#import <UIKit/UIKit.h>


@interface TestController : UIViewController

@property() void (^callback)(NSDictionary*);

@end

#endif /* DemoUIView_h */
