<?php

namespace app\controllers;


use app\models\Device;
use app\models\Macro;
use app\models\Room;
use app\models\Action;
use Yii;
use yii\web\NotFoundHttpException;

class MacroController extends RestController
{
    public $modelClass = 'app\models\Macro';

    public function actions()
    {
        $actions = parent::actions();

        unset($actions['index']);
        unset($actions['view']);

        unset($actions['create']);
        unset($actions['delete']);
        unset($actions['update']);

        return $actions;
    }

    public function actionIndex()
    {
        return Macro::find()->where(['user_id' => Yii::$app->user->id])->all();
    }

    public function actionView($id) {
        $action = Action::find()->where(['macro_id' => $id])->all();
        foreach ($action as $value) {
            $device = Device::findOne(['id' => $value->device_id]);
            $device->value = $value->value; 
            $device->save();     
        }
        return $action;
    }

    public function actionCreate()
    {
        $macro = new Macro();
        $macro->load(Yii::$app->request->post(), '');
        $macro->user_id = Yii::$app->user->id;
        if($macro->validate() && $macro->save(false))
            return $macro;

        return $macro->errors;
    }

    public function actionDelete($id)
    {
        $macro = Macro::findOne($id);

        if(!$macro || $macro->user_id != Yii::$app->user->id)
            return [
                'success' => false
            ];

        if($macro->delete())
            return [
                'success' => true
            ];
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['authenticator'] = [
            'class' => \yii\filters\auth\HttpBearerAuth::className()
        ];

        return $behaviors;
    }
}