<?php
/**
 * @package    PB LiveZilla
 *
 * @author     Sebastian Brümmer <sebastian@produktivbuero.de>
 * @copyright  Copyright (C) 2018 *produktivbüro . All rights reserved
 * @license    GNU General Public License version 2 or later
 */

defined('_JEXEC') or die;

use Joomla\CMS\Application\CMSApplication;
use Joomla\CMS\Plugin\CMSPlugin;

/**
 * PB LiveZilla plugin.
 *
 * @package  PB LiveZilla
 * @since    0.9.0
 */
class plgSystemPbLiveZilla extends CMSPlugin
{
  /**
   * Application object
   *
   * @var    CMSApplication
   * @since  0.9.0
   */
  protected $app;

  /**
   * Affects constructor behavior. If true, language files will be loaded automatically.
   *
   * @var    boolean
   * @since  0.9.0
   */
  protected $autoloadLanguage = true;

  /**
   * This function is called on initialization.
   *
   * @return  void.
   *
   * @since   0.9.0
   */

  public function __construct(&$subject, $config = array())
  {

    parent::__construct($subject, $config);

    $params = new JRegistry($config['params']);

    $this->livezilla = array();

    // Basic parameters
    $this->livezilla['code'] = $params->get('code');
    $this->livezilla['exclude'] = (array) $params->get('exclude');
    $this->livezilla['lang'] = (array) $params->get('lang');
    $this->livezilla['optout_cookie'] = $params->get('optout_cookie', '1');
    $this->livezilla['optout_tracking'] = $params->get('optout_tracking', '1');
    $this->livezilla['cookies']['name'] = 'pb-livezilla-disable-cookie'; // cookie name (fixed)
    $this->livezilla['tracking']['name'] = 'pb-livezilla-disable-tracking'; // cookie name (fixed)
      
  }


  /**
   * This event is triggered before the framework creates the head section of the Document.
   *
   * @return  void.
   *
   * @since   0.9.0
   */
  public function onBeforeCompileHead()
  {
    // fast fail
    if ($this->app->isAdmin()) {
      return;
    }

    // Excluded menu items
    $current = $this->app->getMenu()->getActive()->id;
    if (in_array($current, $this->livezilla['exclude'])) {
      return;
    }

    // Test languages
    $lang = JFactory::getLanguage()->getTag();
    if (!empty($this->livezilla['lang']) && !in_array($lang, $this->livezilla['lang'])) {
      return;
    }

    $doc = JFactory::getDocument();

    $settings = array();

    // Plugin parameters
    $settings = $this->livezilla;

    // Language strings
    $settings['cookies']['disable'] = JText::_('PLG_SYSTEM_PBLIVEZILLA_OPTOUT_COOKIES_LINK_DISABLE');
    $settings['cookies']['off'] = JText::_('PLG_SYSTEM_PBLIVEZILLA_OPTOUT_COOKIES_OFF');
    $settings['tracking']['disable'] = JText::_('PLG_SYSTEM_PBLIVEZILLA_OPTOUT_TRACKING_LINK_DISABLE');
    $settings['tracking']['off'] = JText::_('PLG_SYSTEM_PBLIVEZILLA_OPTOUT_TRACKING_OFF');

    // Insert global settings object
    $script = 'window.pb = window.pb || {}; window.pb.livezilla = '. json_encode($settings, JSON_FORCE_OBJECT);
    $doc->addScriptDeclaration( $script );
  }


  /**
   * This event is triggered after the framework has rendered the application.
   * When this event is triggered the output of the application is available in the response buffer.
   *
   * @return  void.
   *
   * @since   0.9.0
   */
  public function onAfterRender()
  {
    // fast fail
    if ($this->app->isAdmin() || empty($this->livezilla['code'])) {
      return;
    }

    // Excluded menu items
    $current = $this->app->getMenu()->getActive()->id;
    if (in_array($current, $this->livezilla['exclude'])) {
      return;
    }

    // Test languages
    $lang = JFactory::getLanguage()->getTag();
    if (!empty($this->livezilla['lang']) && !in_array($lang, $this->livezilla['lang'])) {
      return;
    }

    // Code
    $insert = $this->livezilla['code'];

    // Basic scripts
    $insert .= "\n<script async src='".Juri::base(true)."/media/plg_system_pblivezilla/js/basics.js'></script>\n";

    // Insert
    $buffer = $this->app->getBody();
    $buffer = str_ireplace('</body>', $insert . '</body>', $buffer);
    $this->app->setBody($buffer);
  }


  /**
   * This is the first stage in preparing content for output and is the
   * most common point for content orientated plugins to do their work.
   *
   * @param   string   $context  The context of the content being passed to the plugin.
   * @param   object   &$row     The article object.  Note $article->text is also available
   * @param   mixed    &$params  The article params
   * @param   integer  $page     The 'page' number
   *
   * @return  void.
   *
   * @since   0.9.0
   */
  public function onContentPrepare($context, &$row, &$params, $page = 0)
  {
    // fast fail
    if ($this->app->isAdmin() || JString::strpos($row->text, '{plg_system_pblivezilla') === false) {
      return;
    }

    // Load language from site
    $lang = JFactory::getLanguage();
    $lang->load('plg_'.$this->_type.'_'.$this->_name, JPATH_SITE);

    // Replace shortcodes
    if ( $this->livezilla['optout_cookie'] && JString::strpos($row->text, '{plg_system_pblivezilla_optout_cookies') !== false ) {
      $insert = '<a href="javascript:pbLiveZilla.disableCookies()" id="livezilla.cookies.link">'.JText::_('PLG_SYSTEM_PBLIVEZILLA_OPTOUT_COOKIES_LINK_DISABLE').'</a><span id="livezilla.cookies.status">'.JText::_('PLG_SYSTEM_PBLIVEZILLA_OPTOUT_ENABLED').'</span>';
      $regex = '/{plg_system_pblivezilla_optout_cookies}/im';
      $row->text = preg_replace($regex, $insert, $row->text);
    }

    if ( $this->livezilla['optout_tracking'] && JString::strpos($row->text, '{plg_system_pblivezilla_optout_tracking') !== false ) {
      $insert = '<a href="javascript:pbLiveZilla.disableTracking()" id="livezilla.tracking.link">'.JText::_('PLG_SYSTEM_PBLIVEZILLA_OPTOUT_TRACKING_LINK_DISABLE').'</a><span id="livezilla.tracking.status">'.JText::_('PLG_SYSTEM_PBLIVEZILLA_OPTOUT_ENABLED').'</span>';
      $regex = '/{plg_system_pblivezilla_optout_tracking}/im';
      $row->text = preg_replace($regex, $insert, $row->text);
    }

  
  }

}
