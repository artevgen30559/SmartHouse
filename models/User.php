<?php

namespace app\models;

use Yii;
use yii\web\IdentityInterface;

/**
 * This is the model class for table "user".
 *
 * @property int $id
 * @property string $login
 * @property string $password
 * @property string $token
 *
 * @property Room[] $rooms
 */
class User extends \yii\db\ActiveRecord implements IdentityInterface
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'user';
    }

    public function isReal($attribute, $params)
    {
        $user = self::findOne(['login' => $this->login]);

        if(!$user || $user->password != $this->password)
            $this->addError('login', 'login or password incorrect');
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['login', 'password'], 'required'],
            [['login'], 'isReal', 'on' => ['login']],
            [['login', 'password'], 'string', 'max' => 15],
            [['token'], 'string', 'max' => 32],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'login' => 'Login',
            'password' => 'Password',
            'token' => 'Token',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMacros()
    {
        return $this->hasMany(Macro::className(), ['user_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRooms()
    {
        return $this->hasMany(Room::className(), ['user_id' => 'id']);
    }

    public static function findIdentity($id)
    {
        return static::findOne($id);
    }

    public static function findIdentityByAccessToken($token, $type = null)
    {
        return static::findOne(['token' => $token]);
    }

    public function getId()
    {
        return $this->id;
    }

    public function getAuthKey()
    {
        return $this->authKey;
    }

    public function validateAuthKey($authKey)
    {
        return $this->authKey === $authKey;
    }

    public function login()
    {
        if($this->validate()) {

            $user = self::findOne(['login' => $this->login]);

            $user->token = Yii::$app->security->generateRandomString();
            $user->save();

            return [
                'token' => $user->token
            ];
        } else {
            return [
                'errors' => $this->errors
            ];
        }
    }
}
