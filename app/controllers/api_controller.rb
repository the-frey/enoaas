class ApiController < ApplicationController

  def text
    phone_number = params[:from]
    content = params[:content]
  end

end