<?php
/**
 * @package    PB LiveZilla
 *
 * @author     Sebastian Brümmer <sebastian@produktivbuero.de>
 * @copyright  Copyright (C) 2018 *produktivbüro . All rights reserved
 * @license    GNU General Public License version 2 or later
 */

defined('_JEXEC') or die;

/**
 * PB LiveZilla script file.
 *
 * @package     PB LiveZilla
 * @since       0.9.1
 */
class plgSystemPbLiveZillaInstallerScript
{
  /**
   * Constructor
   *
   * @param   JAdapterInstance  $adapter  The object responsible for running this script
   */
  public function __construct(JAdapterInstance $adapter) {}


  /**
   * Called after any type of action
   *
   * @param   string  $route  Which action is happening (install|uninstall|discover_install|update)
   * @param   JAdapterInstance  $adapter  The object responsible for running this script
   *
   * @return  boolean  True on success
   */
  public function postflight($route, JAdapterInstance $adapter) {
    if ($route == 'install')
    {
      echo '<div class="alert alert-info">';
      echo '<strong>' . JText::_('PLG_SYSTEM_PBLIVEZILLA') . '</strong> - ' . JText::_('PLG_SYSTEM_PBLIVEZILLA_INSTALL_MESSAGE');
      echo '</div>';
    }
    return true;
  }
}
