/**
 * observer 생성자 정의
 * @returns {*}
 * @constructor
 */
nts.observer = function () {
    var me = this;

    if (!(me instanceof nts.observer)) {
        return new nts.observer();
    }

    me._eventHandler = $(this);

    return me;
};

/**
 * observer 객체의 프로토타입 정의
 */
nts.observer.prototype = {

    /**
     * 이벤트 핸들러에 커스텀 이벤트를 저장
     * @param {string} event 커스텀 이벤트 명
     * @param {function} callback 콜백 함수
     * @public
     */
    subscribe: function (event, callback) {
        this._eventHandler.on(event, callback);
    },

    /**
     * 이벤트 핸들러에 커스텀 이벤트를 삭제
     * @param {string} event 커스텀 이벤트 명
     * @public
     */
    unSubscribe: function (event) {
        this._eventHandler.off(event);
    },

    /**
     * 이벤트 핸들러에 저장되어있는 이벤트를 실행
     * @param {string} event 커스텀 이벤트 명
     * @public
     */
    publish: function (event) {
        this._eventHandler.trigger(event);
    }
};
