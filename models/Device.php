<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "device".
 *
 * @property int $id
 * @property int $room_id
 * @property int $type_id
 * @property string $name
 * @property string $value
 *
 * @property Room $room
 * @property DeviceType $type
 */
class Device extends \yii\db\ActiveRecord
{
    public function fields()
    {
        $fields = parent::fields();

        $fields['type_name'] = function($model) {
            return $model->type->name;
        };

        return $fields;
    }


    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'device';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['room_id', 'type_id', 'name', 'value'], 'required', 'on' => 'default'],
            [['value'], 'isCorrect', 'on' => 'upd'],
            [['room_id', 'type_id'], 'integer'],
            [['name'], 'string', 'max' => 60],
            [['value'], 'string', 'max' => 10, 'on' => 'default'],
            [['room_id'], 'exist', 'skipOnError' => true, 'targetClass' => Room::className(), 'targetAttribute' => ['room_id' => 'id']],
            [['type_id'], 'exist', 'skipOnError' => true, 'targetClass' => DeviceType::className(), 'targetAttribute' => ['type_id' => 'id']],
        ];
    }

    public function isCorrect($attribute, $params)
    {
        if(in_array($this->type_id, [1,4]) && !in_array($this->value, ['open', 'close']))
            $this->addError('value', 'Value must be open or close!');
        if(in_array($this->type_id, [2,3]) && !in_array($this->value, ['on', 'off']))
            $this->addError('value', 'Value must be on or off!');
        if($this->type_id == 5 && (!is_numeric($this->value) || $this->value < -100 || $this->value > 100))
            $this->addError('value', 'Value must be integer between -100 and 100!');
        if($this->type_id == 6 && (!is_numeric($this->value) || $this->value < 10 || $this->value > 30))
            $this->addError('value', 'Value must be integer between 10 and 30!');
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'room_id' => 'Room ID',
            'type_id' => 'Type ID',
            'name' => 'Name',
            'value' => 'Value',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getActions()
    {
        return $this->hasMany(Action::className(), ['device_id' => 'id']);
    }


    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRoom()
    {
        return $this->hasOne(Room::className(), ['id' => 'room_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getType()
    {
        return $this->hasOne(DeviceType::className(), ['id' => 'type_id']);
    }
}
