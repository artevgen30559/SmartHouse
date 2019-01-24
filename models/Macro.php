<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "macro".
 *
 * @property int $id
 * @property string $name
 * @property int $user_id
 *
 * @property Action[] $actions
 * @property User $user
 */
class Macro extends \yii\db\ActiveRecord
{
    public $devices;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'macro';
    }

    public function fields()
    {
        return array_merge(parent::fields(), [
            'devices' => 'actions'
        ]);
    }

    public function beforeValidate()
    {
        $temp = [];

        if(!isset($this->devices))
            $this->devices = [];

        foreach ($this->devices as $device) {
            $action = new Action();

            if(isset($device['id']))
                $action->device_id = $device['id'];
            if(isset($device['value']))
                $action->value = $device['value'];


            $temp[] = $action;
        }

        $this->devices = $temp;

        return parent::beforeValidate();
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name'], 'required'],
            [['user_id'], 'integer'],
            [['devices'], 'required'],
            [['devices'], 'deviceValidation'],
            [['name'], 'string', 'max' => 150],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    public function afterSave($insert, $changedAttributes)
    {
        foreach ($this->devices as $device) {
            $device->macro_id = $this->id;
            $device->save(false);
        }

        parent::afterSave($insert, $changedAttributes);
    }

    public function deviceValidation($attributes, $params)
    {
        foreach ($this->devices as $key => $device)
            if(!$device->validate())
                $this->addError('devices['.$key.']', $device->errors);
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'user_id' => 'User ID',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getActions()
    {
        return $this->hasMany(Action::className(), ['macro_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }
}
