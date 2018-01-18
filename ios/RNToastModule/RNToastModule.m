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
#import "MGIDCard/MGIDCard.h"
#import "MGLivenessDetection/MGLiveManager.h"
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
    [app.window.rootViewController presentViewController:one animated:YES completion:nil];
  });
}
//调用身份证识别界面
RCT_EXPORT_METHOD(showIdCardDetection:(NSNumber* __nonnull)isFace callback:(RCTResponseSenderBlock)callback errorCallback:(RCTResponseSenderBlock)errorCallback) {
  dispatch_async(dispatch_get_main_queue(), ^(){
      AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
      UIViewController *weakSelf = app.window.rootViewController;
      BOOL idcard = [MGIDCardManager getLicense];
      if (!idcard) {
        [[[UIAlertView alloc] initWithTitle:@"提示" message:@"SDK授权失败，请检查" delegate:self cancelButtonTitle:@"完成" otherButtonTitles:nil, nil] show];
        return;
      }

      MGIDCardManager *cardManager = [[MGIDCardManager alloc] init];
      [cardManager setScreenOrientation:MGIDCardScreenOrientationPortrait];
      [cardManager IDCardStartDetection:weakSelf
                             IdCardSide:isFace == 0 ? IDCARD_SIDE_FRONT : IDCARD_SIDE_BACK
                                 finish:^(MGIDCardModel *model) {
                                    NSData* image = UIImagePNGRepresentation([model croppedImageOfIDCard]);
                                    callback(@[image]);
                                 }
                                 errr:^(MGIDCardError errorType) {
                                    errorCallback(@[@"cancelOrSimulator"]);
                                 }];
    });
}


//调用人脸识别界面
RCT_EXPORT_METHOD(showFaceDetection:(RCTResponseSenderBlock)callback errorCallback:(RCTResponseSenderBlock)errorCallback){
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  UIViewController *weakSelf = app.window.rootViewController;
  if (![MGLiveManager getLicense]) {
    UIAlertController* alertC = [UIAlertController alertControllerWithTitle:NSLocalizedString(@"title_remind", nil)
                                                                    message:NSLocalizedString(@"key_sdk_license_failure", nil)
                                                             preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction* cancelAction = [UIAlertAction actionWithTitle:NSLocalizedString(@"title_sure", nil)
                                                           style:UIAlertActionStyleCancel
                                                         handler:nil];
    [alertC addAction:cancelAction];
    [weakSelf presentViewController:alertC
                       animated:YES
                     completion:nil];
    return;
  }

  MGLiveManager *liveManager = [[MGLiveManager alloc] init];
  liveManager.actionCount = 3 + 1;
  liveManager.actionTimeOut = 60;
  liveManager.randomAction = false;

  NSMutableArray* actionMutableArray = [[NSMutableArray alloc] initWithCapacity:liveManager.actionCount];
  for (int i = 1; i <= liveManager.actionCount; i++) {
      [actionMutableArray addObject:[NSNumber numberWithInt:i]];
  }
  liveManager.actionArray = (NSArray *)actionMutableArray;

  [liveManager startFaceDecetionViewController:weakSelf
                                        finish:^(FaceIDData *finishDic, UIViewController *viewController) {
                                           [viewController dismissViewControllerAnimated:YES completion:nil];
                                           NSData *resultData = [[finishDic images] valueForKey:@"image_best"];
                                           callback(@[resultData]);
                                        }
                                        error:^(MGLivenessDetectionFailedType errorType, UIViewController *viewController) {
                                           [viewController dismissViewControllerAnimated:YES completion:nil];
                                           errorCallback(@[@"MGLivenessDetectionFailed"]);
                                        }];


}


- (NSArray<NSString *> *)supportedEvents
{
  return @[@"emittingEvent01", @"iseVolume", @"playCallback"];//有几个就写几个
}

@end
