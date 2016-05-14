/**
 * 컨트롤러 생성자 정의
 * @param {Object} model 모델 객체
 * @param {Object} view 뷰 객체
 * @returns {*}
 * @constructor
 */
nts.controller.AutoScrollController = function (model, view) {
    this._model = model;
    this._view = view;
    this._dao = new nts.model.AutoScrollDao(this._model);

    this._bindViewEvents();
    this._bindModelEvents();
    this._dao.findAll();
};

/**
 * 컨트롤러 객체의 프로토타입 정의
 */
nts.controller.AutoScrollController.prototype = {

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
