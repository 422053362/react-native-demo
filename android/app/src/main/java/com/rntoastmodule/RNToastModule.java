package com.rntoastmodule;

import android.app.Activity;
import android.content.Intent;
import android.support.annotation.Nullable;
import android.telecom.Call;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.logging.Logger;

public class RNToastModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    static ArrayBlockingQueue<Object> mQueue = new ArrayBlockingQueue<Object>(1);

    public final static ArrayBlockingQueue<Object> getQueue() {
        if (mQueue == null) {
            mQueue = new ArrayBlockingQueue<Object>(1);
        }
        return mQueue;
    }

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (REQUEST_CODE_DEMO_ACTIVITY_ == requestCode) {
                final WritableMap map = Arguments.createMap();
                map.putString("newUIPromiseMsg01", "newUIPromiseMsg01");
                map.putString("newUIPromiseMsg02", "newUIPromiseMsg02");
                map.putString("result", String.valueOf(resultCode));
                map.putString("activity", activity.getLocalClassName());
                mQueue.add(map);
            }
        }
    };


    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    public RNToastModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(mActivityEventListener);
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return "RNToastModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void showWithCallback(String message, int duration, Callback callback) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
        callback.invoke("callbackMessage01", "callbackMessage02");

    }

    @ReactMethod
    public void showWithPromise(String message, int duration, Promise promise) {
        WritableMap map = Arguments.createMap();
        map.putString("newUIPromiseMsg01", "newUIPromiseMsg01");
        map.putString("newUIPromiseMsg02", "newUIPromiseMsg02");
        if (duration == 1000) {
            promise.resolve(map);
        } else {
            promise.reject("rejectCode", new Exception("123"));
        }
    }

    @ReactMethod
    public void sendEmittingEvents(String message, int duration) {
        WritableMap map = Arguments.createMap();
        map.putString("emittingEventsMsg01", "emittingEventsMsg01");
        map.putString("emittingEventsMsg02", "emittingEventsMsg02");
        sendEvent(getReactApplicationContext(), "emittingEvent01", map);
    }

    @ReactMethod
    public void newUIView(final Callback success, Callback error) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            error.invoke(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
        } else {
            try {
                final Intent intent = new Intent();
                intent.setClass(currentActivity, DemoUiViewActivity.class);
                currentActivity.startActivityForResult(intent, REQUEST_CODE_DEMO_ACTIVITY_);
                success.invoke(getQueue().take());
            } catch (Exception e) {
                error.invoke(E_FAILED_TO_START_DEMO_ACTIVITY, e.getMessage());
            }
        }
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    public static final String E_ACTIVITY_DOES_NOT_EXIST = "activity_does_not_exist";
    public static final String E_FAILED_TO_START_DEMO_ACTIVITY = "failed_to_start_demo_activity";
    public static final int REQUEST_CODE_DEMO_ACTIVITY_ = 1000000;

    @Override
    public void onHostResume() {
        Log.d("RNToastModule", "=========onHostResume=========");
    }

    @Override
    public void onHostPause() {
        Log.d("RNToastModule", "=========onHostPause=========");
    }

    @Override
    public void onHostDestroy() {
        Log.d("RNToastModule", "=========onHostDestroy=========");
    }
}