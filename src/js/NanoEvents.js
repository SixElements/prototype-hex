class NanoEvents {

    constructor() {
        this.events = {};
    }

    emit (event) {
        let args = [].slice.call(arguments, 1)
        // Array.prototype.call() returns empty array if context is not array-like
        ;[].slice.call(this.events[event] || []).filter(function (i) {
          i.apply(null, args)
        })
    }

    on (event, cb) {
        if ( typeof cb !== 'function') {
          throw new Error('Listener must be a function')
        }
    
        (this.events[event] = this.events[event] || []).push(cb)
    
        return function () {
          this.events[event] = this.events[event].filter(function (i) {
            return i !== cb
          })
        }.bind(this)
    }
}   

export default NanoEvents;