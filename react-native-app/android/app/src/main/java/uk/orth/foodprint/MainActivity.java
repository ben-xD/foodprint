package uk.orth.foodprint;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "foodprint";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    MainActivity self = this;
    return new ReactActivityDelegate(this, getMainComponentName()) {
      private Bundle props = null;
      
      @Override
      protected void onCreate(Bundle savedInstanceState) {
        props = self.getIntent().getExtras();
        if (props != null) {
          for (String key: props.keySet()) {
            Log.d("BensDebugger", key + " is a key in the bundle");
          }
        }  else {
          Log.d("BensDebugger", "Props is null");
        }
        super.onCreate(savedInstanceState);
      }
      
      @Override
      protected Bundle getLaunchOptions() {
        return props;
      }
      
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}
