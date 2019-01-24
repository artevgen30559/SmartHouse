<?php

namespace app\controllers;


use app\models\Device;
use app\models\Room;
use Yii;
use yii\web\NotFoundHttpException;
use yii\web\UnauthorizedHttpException;

class DeviceController extends RestController
{
    public $modelClass = 'app\models\Device';

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
    public function actionIndex() {
        $device = Device::find()->all();
        return $device;
    }
    public function actionView($id)
    {
        $device = Device::findOne($id);

        if(!$device || !Room::findOne(['id' => $device->room_id, 'user_id' => Yii::$app->user->id]))
            return null;

        return $device;
    }

    public function actionUpdate($id)
    {
        $device = Device::findOne($id);

        if(!$device)
            return new NotFoundHttpException();

        if(!Room::findOne(['id' => $device->room_id, 'user_id' => Yii::$app->user->id]))
            return new UnauthorizedHttpException();

        $data = Yii::$app->request->post();

        if(isset($data['value'])) {
            $device->value = $data['value'];

            $device->scenario = 'upd';

            if($device->validate() && $device->save()) {
                return $device;
            }

            return $device->errors;
        }

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