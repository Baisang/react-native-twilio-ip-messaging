let React = require('react-native')

let {
    NativeModules,
    NativeAppEventEmitter
} = React

let {
    TwilioIPMessagingClient
} = NativeModules

class UserInfo {
    constructor(props) {
        this.identity = props.identity
        this.friendlyName = props.friendlyName
        this.attributes = props.attributes
        this.isOnline = props.isOnline
        this.isNotifiable = props.isNotifiable

        this.onUpdate = null

        // event handlers
        this._userInfoUpdateSubscription = NativeAppEventEmitter.addListener(
            'ipMessagingClient:userInfoUpdated',
            ({updated, userInfo}) => {
                if (userInfo.identity == this.identity) {
                    this.friendlyName = userInfo.friendlyName
                    this.attributes = userInfo.attributes
                    this.isOnline = userInfo.isOnline
                    this.isNotifiable = userInfo.isNotifiable
                    if (this.onUpdate) this.onUpdate(updated)
                }
            }
        )
    }
    
    setAttributes(attributes) {
        return TwilioIPMessagingClient.setAttributes(attributes)
    }
    
    setFriendlyName(friendlyName) {
        return TwilioIPMessagingClient.setFriendlyName(friendlyName)
    }

    close() {
        this._userInfoUpdateSubscription.remove()
    }
}

module.exports = UserInfo