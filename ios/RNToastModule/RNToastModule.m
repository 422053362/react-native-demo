//
//  CalendarManager.m
//  HelloWorld
//
//  Created by chenyong on 2017/9/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RNToastModule.h"
#import "TestController.h"
#import "AppDelegate.h"
#import <React/RCTConvert.h>
#import <React/RCTBridge.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTEventDispatcher.h>

@implementation RNToastModule: RCTEventEmitter

//默认名称
RCT_EXPORT_MODULE()
//对外提供调用方法
RCT_EXPORT_METHOD(showWithCallback:(NSString *)message duration:(NSNumber * __nonnull)duration callback:(RCTResponseSenderBlock)callback){
  NSLog(@"@%@",message);
  callback(@[message,[duration stringValue]]);
}

//对外提供调用方法,演示Promise使用
RCT_REMAP_METHOD(showWithPromise,
                  message:(NSString *)message
                  duration:(NSNumber * __nonnull)duration
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSArray *events =@[@"张三",@"李四",@"王五",@"赵六"];
  if ([duration integerValue] < 2000) {
    resolve(events);
  } else {
    NSError *error=[NSError errorWithDomain:@"我是Promise回调错误信息..." code:101 userInfo:nil];
    reject(@"no_events", @"There were no events", error);
  }
}

//进行触发发送通知事件
RCT_EXPORT_METHOD(sendEmittingEvents:(NSString *)name duration:(NSNumber * __nonnull)duration){
  [self sendEventWithName:@"emittingEvent01" body:@{@"emittingEventsMsg01": @"emittingEventsMsg01" ,@"emittingEventsMsg02": @"emittingEventsMsg02"}];
}

//原生界面展示
RCT_EXPORT_METHOD(newUIView:(RCTResponseSenderBlock)callback error:(RCTResponseSenderBlock)error){
  NSLog(@"RN传入原生界面的数据为:%@",@"123");
  //主要这里必须使用主线程发送,不然有可能失效
  dispatch_async(dispatch_get_main_queue(), ^{
    TestController *one = [[TestController alloc]init];
    one.callback = ^(NSDictionary* dic){
      callback(@[dic]);
    };
    AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [app.nav pushViewController:one animated:YES];
  });
}


- (NSArray<NSString *> *)supportedEvents
{
  return @[@"emittingEvent01", @"iseVolume", @"playCallback"];//有几个就写几个
}

@end
