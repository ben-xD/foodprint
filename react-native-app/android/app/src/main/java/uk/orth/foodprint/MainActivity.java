package uk.orth.foodprint;

import android.app.Activity;
import android.net.Uri;
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
      private Bundle newProps = null;
      
      @Override
      protected void onCreate(Bundle savedInstanceState) {
        newProps = new Bundle();
        props = self.getIntent().getExtras();
        if (props != null) {
          for (String key: props.keySet()) {
            Log.d("FOODPRINT", key + " is a key in the bundle");
          }
          if (props.containsKey("android.intent.extra.TEXT")) {
            Log.d("FOODPRINT", "recipeUrl: " + props.getString("android.intent.extra.TEXT"));
            newProps.putString("android.intent.extra.TEXT", props.getString("android.intent.extra.TEXT"));
          }
        }  else {
          Log.d("FOODPRINT", "Props is null");
        }
        super.onCreate(savedInstanceState);
      }
      
      @Override
      protected Bundle getLaunchOptions() {
        return newProps;
      }
      
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}
