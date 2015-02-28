# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  config.vm.box = "avenuefactory/lamp"
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.network "private_network", ip: "192.168.10.10"
 
  config.vm.synced_folder "./", "/var/www/html", id: "vagrant-root",
    owner: "vagrant",
    group: "www-data",
    mount_options: ["dmode=775,fmode=664"]
    
  # config.vm.provision :shell, :path => "vagrant-bootstrap.sh"

end
