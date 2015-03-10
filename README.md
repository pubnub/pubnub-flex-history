# pubnub-flex-history
A Javascript History wrapper for flexible history calls. In all the methods, an unix epoch timestamp or a PubNub 17 digit timetoken can be provided where timetokens are expected.

## Include

```javascript
<script src="//cdn.rawgit.com/scalabl3/pubnub-flex-history/v1.0/pubnub-flex-history.js"></script>
```

## Setup Example

```javascript
<script src="//cdn.pubnub.com/pubnub-3.7.8.js"></script>
<script src="//cdn.rawgit.com/scalabl3/pubnub-flex-history/master/pubnub-flex-history.js"></script>
<script>
  // Call Init first to create a PubNub instance, then add the wrapper method to that object
  var p = PUBNUB.init({
    publish_key: 'demo',
    subscribe_key: 'demo'
  });

  p.flex_history = pubnub_flex_history;
  
  var flex_history_callback = function(result) {
    if (!result.error) {
      console.log(result.operation + " completed", result);
    }
    else {
      console.warn(result.operation + " failed", result);
    }
  }
</script>
```

## Usage Options ##

### general ###

The general usage follows as:

    p.flex_history(options_object, completed_callback)

options_object requires a channel name, and a command which is one of [last, since, between, at, getrange]

```javascript
{
  channel: [channelname]
}
```

### last ###

Gets the last n messages from the channel.

```javascript
p.flex_history({
    channel: 'AAPL',
    last: 20
}, function(result) {
    console.log("last 20 completed", result);
});
```

### since ###

Get all messages since timetoken

```javascript

var since = 1426010693;

var options = {
  channel: 'AAPL',
  since: since
}

p.flex_history(options, flex_history_callback);

```

### between ###


### at ###


### getrange ###

