/**
 * 컨트롤러 생성자 정의
 * @param {Object} model 모델 객체
 * @param {Object} view 뷰 객체
 * @returns {*}
 * @constructor
 */
nts.controller = function (model, view) {
    var me = this;

    if (!(me instanceof nts.controller)) {
        return new nts.controller(model, view);
    }

    me._model = model;
    me._view = view;
    me._dao = new nts.dao(me._model);

    me._init();

    return me;
};

/**
 * 컨트롤러 객체의 프로토타입 정의
 */
nts.controller.prototype = {

    /**
     * 컨트롤러 최초 실행 함수
     * ajax로 local json을 호출
     * @private
     */
    _init: function () {
        this._bindViewEvents();
        this._bindModelEvents();

        this._dao.callData();
    },

    /**
     * view element에 이벤트를 바인드
     * @private
     */
    _bindViewEvents: function () {
        this._view._getMore.on('click', this._onClickChange.bind(this));
    },

    /**
     * 모델에 커스텀 이벤트를 바인드
     * @private
     */
    _bindModelEvents: function () {
        this._model.addEventListener('update', this._onUpdateModel.bind(this));
    },

    /**
     * 클릭 이벤트일 때 실행
     * @private
     */
    _onClickChange: function () {
        this._onUpdateModel();
    },

    /**
     * 모델 update일 때 실행
     * @private
     */
    _onUpdateModel: function () {
        this._view.render(this._model.localData);
    }
};
