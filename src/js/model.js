/**
 * 모델 생성자 정의
 * @returns {*}
 * @constructor
 */
nts.model = function () {
    var me = this;

    if (!(me instanceof nts.model)) {
        return new nts.model();
    }

    me._data = [];
    me._observer = new nts.observer();

    return me;
};

/**
 * 모델 객체의 프로토타입 정의
 */
nts.model.prototype = {

    /**
     * 데이터를 호출
     * @returns {Array}
     * @public
     */
    get localData() {
        return this._data;
    },

    /**
     * 데이터에 값을 저장
     * @param {Object} data dao 객체에서 보낸 데이터
     * @public
     */
    set localData(data) {
        this._data = data.items;
        this.dispatchEvent('update');
    },

    /**
     * 옵저버 객체에 커스텀 이벤트를 등록
     * @param {string} event 커스텀 이벤트 명
     * @param {function} callback 콜백 함수
     */
    addEventListener: function (event, callback) {
        this._observer.subscribe(event, callback);
    },

    /**
     * 옵저버 객체에 있는 커스텀 이벤트를 실행
     * @param {string} event 커스텀 이벤트 명
     */
    dispatchEvent: function (event) {
        this._observer.publish(event);
    }
};
