<?php

namespace app\controllers;


use app\models\Room;
use Yii;

class RoomController extends RestController
{
    public $modelClass = 'app\models\Room';

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
        return Room::find()->where(['user_id' => Yii::$app->user->id])->select('id, name, photo')->all();
    }

    public function actionDevices($id)
    {
        $room = Room::findOne(['id' => $id, 'user_id' => Yii::$app->user->id]);

        if(!$room)
            return [];

        return $room->devices;
    }

    public function actionView($id)
    {
        $room = Room::findOne(['id' => $id, 'user_id' => Yii::$app->user->id]);

        if(!$room)
            return null;

        unset($room->user_id);

        return $room;
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